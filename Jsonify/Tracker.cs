using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace Anno1800.Jsonify {
  class Tracker {
    public static void Track(
      Dictionary<string, XElement> assetsMap,
      Dictionary<string, List<Asset>> dataDict,
      Dictionary<string, string> localization,
      string output
      ) {
      SortedDictionary<string, List<string>> assetsReport = new SortedDictionary<string, List<string>>(dataDict
        .ToDictionary(
          kvp => kvp.Key,
          kvp => kvp
            .Value
            .Select(data => localization.ContainsKey(data.guid.ToString()) ? localization[data.guid.ToString()] : data.guid.ToString())
            .ToList()
          ));

      var paths = new List<string> {
        "Cost",
        "Cost/Costs/Item",
        "Maintenance",
        "Maintenance/Maintenances/Item",
        "Building",
        "Upgradable",
        "Upgradable/UpgradeCost/Item",
        "Culture",
        "Culture/SetPages/Item",
        "Culture/SetPages/Item/Page/Item",
        "ModuleOwner",
        "Electric",
        "Pausable",
        "Constructable",
        "Residence7",
        "Residence7/ResidenceStorage",
        "Factory7",
        "FactoryBase",
        "FreeAreaProductivity",
        "Slot",
        "Bridge",
        "Street",
        "Warehouse",
        "Warehouse/WarehouseStorage",
        "LogisticNode",
        "LogisticNode/QueueConfiguration",
        "StorageBase",
        "StorageBase/StoredProducts/Item",
        "Market",
      };

      Dictionary<string, List<string>> xmlReport = paths.ToDictionary(
        path => path,
        path => {
          var isItem = path.EndsWith("Item");
          path = isItem ? path.Replace("/Item", "") : path;
          var elements = assetsMap
            .Select(kvp => kvp.Value.Element("Values").ElementByPath(path))
            .Where(el => el != null);
          if (isItem && elements.Count() > 0) {
            elements = elements.Select(el => el.Elements()).Aggregate((agg, cur) => agg.Concat(cur));
          }
          return elements.Count() > 0
            ? elements
              .Select(el => el.Elements().Where(el => el.Name != "VectorElement").Select(el => el.Name.ToString()))
              .Aggregate((agg, cur) => agg.Concat(cur))
              .ToHashSet()
              .ToList()
            : new List<string>();
        });

      var report = new Dictionary<string, object> {
        { "xml", xmlReport },
        { "assets", assetsReport }
      };

      var dest = Path.Combine(output, "report.json");
      IO.Save(JsonConvert.SerializeObject(report, Formatting.Indented), dest);
      Console.WriteLine($"Report: {dest}");
    }
  }
}
