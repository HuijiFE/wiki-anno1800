using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace Anno1800.Jsonify {
  partial class Asset {
    [JsonProperty(Order = -6)]
    public int guid;
    [JsonProperty(Order = -5)]
    public string? name;
    [JsonProperty(Order = -4)]
    public string? id;
    [JsonProperty(Order = -3)]
    public string? icon;
    [JsonProperty(Order = -2)]
    public int? description;

    public Asset(XElement asset, Dictionary<string, XElement> map) {
      var values = asset.Element("Values");
      var standard = values.Element("Standard");

      this.guid = standard.Int("GUID");
      this.name = standard.String("Name");
      this.id = standard.String("ID");
      this.icon = standard.String("IconFilename");
      this.description = standard.Int("InfoDescription");
    }

    // ================================
    // global

    static (Dictionary<string, XElement>, Dictionary<string, List<XElement>>) ResolveRaw(XDocument assetsDoc) {
      // GUID assets map
      var map = new Dictionary<string, XElement>();
      // template assets map
      var dict = new Dictionary<string, List<XElement>>();

      Action<XElement> walk = null;
      walk = (elem) => {
        if (elem.Name == "Asset") {
          var guid = elem.Element("Values")?.Element("Standard")?.Element("GUID")?.Value;
          map.Add(guid, elem);
          return;
        }
        foreach (var child in elem.Elements()) {
          walk(child);
        }
      };
      walk(assetsDoc.Root);

      Func<XElement, string> getGUID = null;
      getGUID = (asset) => {
        var template = asset.Element("Template")?.Value;
        if (template == null) {
          var baseAssetGUID = asset.Element("BaseAssetGUID")?.Value;
          if (baseAssetGUID == null) {
            return "_Unknown";
          }
          var baseAsset = map.ContainsKey(baseAssetGUID) ? map[baseAssetGUID] : null;
          if (baseAsset == null) {
            return "_Unknown";
          }
          return getGUID(baseAsset);
        }
        return template;
      };

      foreach ((string guid, XElement asset) in map) {
        var template = getGUID(asset);
        if (dict.ContainsKey(template)) {
          dict[template].Add(asset);
        } else {
          dict.Add(template, new List<XElement> { asset });
        }
      }

      return (map, dict);
    }

    static Dictionary<string, XElement> ResolveTemplates(XDocument templatesDoc) {
      var map = new Dictionary<string, XElement>();

      Action<XElement> walk = null;
      walk = (elem) => {
        if (elem.Name == "Template") {
          map.Add(elem.Element("Name").Value, elem);
          return;
        }
        foreach (var child in elem.Elements()) {
          walk(child);
        }
      };

      walk(templatesDoc.Root);

      return map;
    }

    static void ResolveInheritance(Dictionary<string, XElement> assetsMap, Dictionary<string, XElement> templatesMap) {
      Action<XElement, XElement> inherit = null;
      inherit = (derived, @base) => {
        var derivedChildren = derived.Elements().ToList();
        var baseChildren = @base.Elements().ToList();
        if (derivedChildren.Any(c => c.Name == "Item") || baseChildren.Any(c => c.Name == "Item")) {
          foreach (var derivedItem in derivedChildren) {
            var index = derivedItem.Element("VectorElement")?.Element("InheritanceMapV2")?.Element("Entry")?.Element("Index")?.Value;
            if (index == null) {
              index = derivedItem.Element("VectorElement")?.Element("InheritedIndex")?.Value;
            }
            derivedItem.Element("VectorElement")?.Remove();
            if (index != null) {
              var baseItem = baseChildren[int.Parse(index)];
              if (baseItem.HasElements) {
                inherit(derivedItem, baseItem);
              } else {
                derivedItem.Value = baseItem.Value;
              }
            }
          }
        } else {
          foreach (var baseChild in baseChildren) {
            var derivedChild = derivedChildren.Find(c => c.Name == baseChild.Name);
            if (derivedChild == null) {
              derived.Add(baseChild);
            } else if (derivedChild.HasElements || baseChild.HasElements) {
              inherit(derivedChild, baseChild);
            }
          }
        }
      };

      Action<XElement> resolve = null;
      resolve = (asset) => {
        var baseAssetGUID = asset.Element("BaseAssetGUID");
        if (baseAssetGUID == null) {
          return;
        }
        var baseAsset = assetsMap.ContainsKey(baseAssetGUID.Value) ? assetsMap[baseAssetGUID.Value] : null;
        if (baseAsset == null) {
          return;
        }

        resolve(baseAsset);
        asset.AddFirst(baseAsset.Element("Template"));
        inherit(asset.Element("Values"), baseAsset.Element("Values"));
        baseAssetGUID.Remove();
      };

      foreach ((string guid, XElement asset) in assetsMap) {
        resolve(asset);
      }
      foreach ((string guid, XElement asset) in assetsMap) {
        var templateName = asset.Element("Template").Value;
        var template = templatesMap[templateName];
        inherit(asset.Element("Values"), template.Element("Properties"));
      }
    }

    static Dictionary<string, List<Asset>> AdaptAll(Dictionary<string, XElement> assetsMap) {
      var adaptersMap = typeof(Asset)
        .Assembly
        .GetTypes()
        .Where(t => t.IsSubclassOf(typeof(Asset)) && t.GetCustomAttributes(true).Any(a => (a as AdapterAttribute) != null))
        .ToDictionary(a => a.Name, a => a);

      var dataMap = new Dictionary<string, List<Asset>>();

      foreach ((string guid, XElement asset) in assetsMap) {
        var template = asset.Element("Template").Value;
        if (adaptersMap.ContainsKey(template)) {
          var data = (Asset)Activator.CreateInstance(adaptersMap[template], asset, assetsMap);
          if (dataMap.ContainsKey(template)) {
            dataMap[template].Add(data);
          } else {
            dataMap.Add(template, new List<Asset> { data });
          }
        }
      }

      return dataMap;
    }

    static public void Convert(string input, string output) {
      if (!Directory.Exists(output)) {
        Directory.CreateDirectory(output);
      }
      var raw = Path.Combine(output, "raw");
      if (!Directory.Exists(raw)) {
        Directory.CreateDirectory(raw);
      }

      var assetsDoc = XDocument.Load(Path.Combine(input, "assets.xml"));
      var propertiesDoc = XDocument.Load(Path.Combine(input, "properties.xml"));
      var templatesDoc = XDocument.Load(Path.Combine(input, "templates.xml"));

      var (assetsMap, dict) = Asset.ResolveRaw(assetsDoc);
      var templatesMap = Asset.ResolveTemplates(templatesDoc);
      Asset.ResolveInheritance(assetsMap, templatesMap);
      var dataMap = Asset.AdaptAll(assetsMap);

      foreach ((string template, List<XElement> list) in dict) {
        var dest = Path.Combine(raw, $"{template}.xml");
        var destDir = Path.GetDirectoryName(dest);
        if (!Directory.Exists(destDir)) {
          Directory.CreateDirectory(destDir);
        }
        new XDocument(new XElement("Assets", new XAttribute("Count", list.Count), list)).Save(dest);
      }

      foreach ((string template, List<Asset> dataList) in dataMap) {
        var dest = Path.Combine(output, $"{template}.json");
        using (var sw = File.CreateText(dest)) {
          sw.Write(JsonConvert.SerializeObject(dataList, Formatting.Indented));
          Console.WriteLine(dest);
        }
      }

      Console.WriteLine($"Assets: {dict.Values.Aggregate(0, (total, list) => total += list.Count)}");
    }
  }
}
