using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace Anno1800.Jsonify {
  partial class Asset {
    //[JsonProperty(Order = -7)]
    //public string template {
    //  get {
    //    return this.GetType().Name;
    //  }
    //}
    [JsonProperty(Order = -6)]
    [Element("Standard/GUID")]
    public int guid;
    [JsonProperty(Order = -5)]
    [Element("Standard/Name")]
    public string name;
    [JsonProperty(Order = -4)]
    [Element("Standard/ID")]
    public string id;
    [JsonProperty(Order = -3)]
    [Element("Standard/IconFilename")]
    public string icon;
    [JsonProperty(Order = -2)]
    [Element("Standard/InfoDescription")]
    public int? description;

    public Asset(XElement asset, Dictionary<string, XElement> map) {
      Adapter.Deserialize(this, asset.Element("Values").Elements());
    }

    // ================================
    // global

    static (Dictionary<string, XElement>, Dictionary<string, List<XElement>>) ResolveRaw(XDocument assetsDoc) {
      // GUID assets map
      var map = new Dictionary<string, XElement>();
      // template assets map
      var dict = new Dictionary<string, List<XElement>>();

      Action<XElement> walk = null;
      walk = (element) => {
        if (element.Name == "Asset") {
          var guid = element.String("Values/Standard/GUID", "0");
          map.Add(guid, element);
          return;
        }
        foreach (var child in element.Elements()) {
          walk(child);
        }
      };
      walk(assetsDoc.Root);

      Func<XElement, string> getGUID = null;
      getGUID = (asset) => {
        var template = asset.Element("Template")?.Value;
        if (template == null) {
          var baseAssetGUID = asset.String("BaseAssetGUID");
          if (string.IsNullOrWhiteSpace(baseAssetGUID)) {
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
      walk = (element) => {
        if (element.Name == "Template") {
          map.Add(element.String("Name"), element);
          return;
        }
        foreach (var child in element.Elements()) {
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
            var index = derivedItem.String("VectorElement/InheritanceMapV2/Entry/Index");
            if (string.IsNullOrWhiteSpace(index)) {
              index = derivedItem.String("VectorElement/InheritedIndex");
            }
            if (!string.IsNullOrWhiteSpace(index)) {
              var baseItem = baseChildren[int.Parse(index)];
              if (baseItem.HasElements) {
                inherit(derivedItem, baseItem);
              } else {
                derivedItem.Value = baseItem.Value;
              }
            }
            derivedItem.Element("VectorElement")?.Remove();
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
        var templateName = asset.String("Template");
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

      var dataDict = new Dictionary<string, List<Asset>>();

      foreach ((string guid, XElement asset) in assetsMap) {
        var template = asset.String("Template");
        if (adaptersMap.ContainsKey(template)) {
          var data = (Asset)Activator.CreateInstance(adaptersMap[template], asset, assetsMap);
          if (dataDict.ContainsKey(template)) {
            dataDict[template].Add(data);
          } else {
            dataDict.Add(template, new List<Asset> { data });
          }
        }
      }

      return dataDict;
    }

    static public (Dictionary<string, XElement>, Dictionary<string, List<Asset>>) Convert(string input, string output) {
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

      var (assetsMap, assetsDict) = Asset.ResolveRaw(assetsDoc);
      var templatesMap = Asset.ResolveTemplates(templatesDoc);
      Asset.ResolveInheritance(assetsMap, templatesMap);
      var dataDict = Asset.AdaptAll(assetsMap);

      foreach ((string template, List<XElement> list) in assetsDict) {
        var dest = Path.Combine(raw, $"{template}.xml");
        var destDir = Path.GetDirectoryName(dest);
        if (!Directory.Exists(destDir)) {
          Directory.CreateDirectory(destDir);
        }
        new XDocument(new XElement("Assets", new XAttribute("Count", list.Count), list)).SaveXML(dest);
      }

      foreach ((string template, List<Asset> dataList) in dataDict) {
        var dest = Path.Combine(output, $"{template}.json");
        IO.Save(JsonConvert.SerializeObject(dataList, Formatting.Indented), dest);
        Console.WriteLine(dest);
      }

      {
        var dest = Path.Combine(output, "definition.ts");
        IO.Save(TypeScript.GetAll(typeof(Asset), typeof(BaseAssetObject)), dest);
        Console.WriteLine(dest);
      }

      var assetsTotal = assetsDict.Values.Aggregate(0, (total, list) => total += list.Count);
      var dataTotal = dataDict.Values.Aggregate(0, (total, list) => total += list.Count);
      Console.WriteLine($"Assets: {assetsTotal}, {dataTotal} extracted.");

      return (assetsMap, dataDict);
    }
  }
}
