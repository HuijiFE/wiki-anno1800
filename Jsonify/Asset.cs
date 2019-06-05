using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace Anno1800.Jsonify {
  partial class Asset {
    [JsonProperty(Order = -7)]
    [TypeAlias("Template")]
    public string template;
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
      this.template = asset.String("Template");
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

    static (Dictionary<string, XElement>, Dictionary<string, XElement>) ResolveProperties(XDocument propertiesDoc) {
      var defaultContainerValues = new Dictionary<string, XElement>();
      var defaultValues = new Dictionary<string, XElement>();

      Action<XElement> walk = null;
      walk = (element) => {
        if (element.Name == "DefaultContainerValues") {
          foreach (var child in element.Elements()) {
            defaultContainerValues.Add(child.Name.ToString(), child);
          }
        } else if (element.Name == "DefaultValues") {
          foreach (var child in element.Elements()) {
            defaultValues.Add(child.Name.ToString(), child);
          }
        } else {
          foreach (var child in element.Elements()) {
            walk(child);
          }
        }
      };

      walk(propertiesDoc.Root);

      return (defaultContainerValues, defaultValues);
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

    static void Inherit(XElement elementDerived, XElement elementBase, bool debug = false) {
      var childrenDerived = elementDerived.Elements().ToList();
      var childrenBase = elementBase.Elements().ToList();
      if (childrenDerived.Any(c => c.Name == "Item") || childrenBase.Any(c => c.Name == "Item")) {
        foreach (var derivedItem in childrenDerived) {
          var indexText = derivedItem.String("VectorElement/InheritanceMapV2/Entry/Index");
          if (string.IsNullOrWhiteSpace(indexText)) {
            indexText = derivedItem.String("VectorElement/InheritedIndex");
          }
          if (!string.IsNullOrWhiteSpace(indexText)) {
            var index = int.Parse(indexText);
            if (index < childrenBase.Count) {
              var baseItem = childrenBase[index];
              if (baseItem.HasElements) {
                Asset.Inherit(derivedItem, baseItem, debug);
              } else {
                derivedItem.Value = baseItem.Value;
              }
            }
          }
          derivedItem.Element("VectorElement")?.Remove();
        }
      } else {
        foreach (var childBase in elementBase.Elements()) {
          var childDerived = elementDerived.Element(childBase.Name);
          if (debug) {
            Console.WriteLine($"{childBase.Name} {childDerived?.Name}");
          }
          if (childDerived == null) {
            elementDerived.Add(childBase);
          } else {
            if (childDerived.HasElements || childBase.HasElements) {
              Asset.Inherit(childDerived, childBase, debug);
            }
          }
        }
      }
    }

    static void InheritContainer(XElement prop, XElement container) {
      var containerValues = container.Element("ContainerValues");
      if (containerValues != null) {
        foreach (var childContainer in container.Elements()) {
          var childProp = prop.Element(childContainer.Name);
          if (childProp != null) {
            foreach (var item in childProp.Elements()) {
              foreach (var defaultValue in childContainer.Elements()) {
                var itemProp = item.Element(defaultValue.Name);
                if (defaultValue.HasElements) {
                  if (itemProp != null) {
                    Asset.InheritContainer(itemProp, defaultValue);
                  }
                } else if (!string.IsNullOrWhiteSpace(defaultValue.Value)) {
                  if (itemProp == null) {
                    item.Add(defaultValue);
                  }
                }
              }
            }
          }
        }
      } else {
        foreach (var childContainer in container.Elements()) {
          var childProp = prop.Element(childContainer.Name);
          if (childProp != null) {
            Asset.InheritContainer(childProp, childContainer);
          }
        }
      }
    }

    static void ResolveInheritance(Dictionary<string, XElement> assetsMap, Dictionary<string, XElement> templatesMap) {
      Action<XElement> resolve = null;
      resolve = (assetDerived) => {
        var baseAssetGUID = assetDerived.Element("BaseAssetGUID");
        if (baseAssetGUID == null) {
          return;
        }
        var assetBase = assetsMap.ContainsKey(baseAssetGUID.Value) ? assetsMap[baseAssetGUID.Value] : null;
        if (assetBase == null) {
          return;
        }

        resolve(assetBase);
        assetDerived.AddFirst(assetBase.Element("Template"));
        var valuesDerived = assetDerived.Element("Values");
        var valuesBase = assetBase.Element("Values");
        foreach (var propBase in valuesBase.Elements()) {
          var propDerived = valuesDerived.Element(propBase.Name);
          if (propDerived != null) {
            Asset.Inherit(propDerived, propBase);
          }
        }
        baseAssetGUID.Remove();
      };

      foreach ((string guid, XElement asset) in assetsMap) {
        var templateName = asset.String("Template");
        if (!string.IsNullOrWhiteSpace(templateName)) {
          var template = templatesMap[templateName];
          var values = asset.Element("Values");
          var properties = template.Element("Properties");
          foreach (var propBase in properties.Elements()) {
            var propDerived = values.Element(propBase.Name);
            if (propDerived != null) {
              Asset.Inherit(propDerived, propBase);
            }
          }
        }
      }
      foreach ((string guid, XElement asset) in assetsMap) {
        resolve(asset);
      }
    }

    static void ResolveDefaultValues(Dictionary<string, XElement> assetsMap, Dictionary<string, XElement> defaultContainerValues, Dictionary<string, XElement> defaultValues) {
      foreach (var (guid, asset) in assetsMap) {
        foreach (var prop in asset.Element("Values").Elements()) {
          if (defaultValues.TryGetValue(prop.Name.ToString(), out var propDefaultValue)) {
            Asset.Inherit(prop, propDefaultValue);
          }
          if (defaultContainerValues.TryGetValue(prop.Name.ToString(), out var container)) {
            Asset.InheritContainer(prop, container);
          }
        }
      }
    }

    static Dictionary<string, List<Asset>> AdaptAll(Dictionary<string, XElement> assetsMap) {
      return typeof(Asset)
        .Assembly
        .GetTypes()
        .Where(t => t.IsSubclassOf(typeof(Asset)) && t.GetCustomAttributes(false).Any(a => (a as AdapterAttribute) != null))
        .ToDictionary(
          adapter => adapter.Name,
          adapter => assetsMap
            .Values
            .Where(asset => asset.String("Template") == adapter.Name)
            .Select(asset => (Asset)Activator.CreateInstance(adapter, asset, assetsMap))
            .ToList()
        );
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

      foreach ((string template, List<XElement> list) in assetsDict) {
        var dest = Path.Combine(raw, $"{template}.xml");
        var destDir = Path.GetDirectoryName(dest);
        if (!Directory.Exists(destDir)) {
          Directory.CreateDirectory(destDir);
        }
        new XDocument(new XElement("Assets", new XAttribute("Count", list.Count), list)).SaveXML(dest);
        Console.WriteLine(dest);
      }

      var templatesMap = Asset.ResolveTemplates(templatesDoc);
      var (defaultContainerValues, defaultValues) = Asset.ResolveProperties(propertiesDoc);
      Asset.ResolveInheritance(assetsMap, templatesMap);
      Asset.ResolveDefaultValues(assetsMap, defaultContainerValues, defaultValues);
      var dataDict = Asset.AdaptAll(assetsMap);

      foreach ((string template, List<Asset> dataList) in dataDict) {
        var dest = Path.Combine(output, $"{template}.json");
        IO.Save(JsonConvert.SerializeObject(dataList, Formatting.Indented), dest);
        Console.WriteLine(dest);
      }

      {
        var dest = Path.Combine(output, "definition.ts");
        IO.Save(TypeScript.GetAll(dataDict, typeof(Asset), typeof(BaseAssetObject)), dest);
        Console.WriteLine(dest);
      }

      var assetsTotal = assetsDict.Values.Aggregate(0, (total, list) => total += list.Count);
      var dataTotal = dataDict.Values.Aggregate(0, (total, list) => total += list.Count);
      Console.WriteLine($"Assets: {assetsTotal}, {dataTotal} extracted.");

      return (assetsMap, dataDict);
    }
  }
}
