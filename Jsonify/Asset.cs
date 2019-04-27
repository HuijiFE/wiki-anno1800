using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  class Asset {

    static void ResolveInheritance(Dictionary<string, XElement> map) {
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
            if (index != null) {
              derivedItem.Element("VectorElement").Remove();
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
        var baseAsset = map.ContainsKey(baseAssetGUID.Value) ? map[baseAssetGUID.Value] : null;
        if (baseAsset == null) {
          return;
        }

        resolve(baseAsset);
        asset.AddFirst(baseAsset.Element("Template"));
        inherit(asset.Element("Values"), baseAsset.Element("Values"));
        baseAssetGUID.Remove();
      };

      foreach ((string guid, XElement asset) in map) {
        resolve(asset);
      }
    }

    static Dictionary<string, XElement> ResolveRaw(XDocument assetsDoc, string output) {
      if (!Directory.Exists(output)) {
        Directory.CreateDirectory(output);
      }

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

      Asset.ResolveInheritance(map);

      foreach ((string template, List<XElement> list) in dict) {
        var dest = Path.Combine(output, $"{template}.xml");
        var destDir = Path.GetDirectoryName(dest);
        if (!Directory.Exists(destDir)) {
          Directory.CreateDirectory(destDir);
        }
        new XDocument(new XElement("Assets", new XAttribute("Count", list.Count), list)).Save(dest);
      }

      Console.WriteLine($"Assets: {dict.Values.Aggregate(0, (total, list) => total += list.Count)}");

      return map;
    }

    static public void Convert(string input, string output) {
      if (!Directory.Exists(output)) {
        Directory.CreateDirectory(output);
      }

      var assetsDoc = XDocument.Load(Path.Combine(input, "assets.xml"));
      var propertiesDoc = XDocument.Load(Path.Combine(input, "properties.xml"));
      var templatesDoc = XDocument.Load(Path.Combine(input, "templates.xml"));

      var map = Asset.ResolveRaw(assetsDoc, Path.Combine(output, "raw"));
    }
  }
}
