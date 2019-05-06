using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class ShipyardData : BaseAssetObject {
      public List<int> assemblyOptions;

      public ShipyardData(XElement element) : base(element) {
        this.assemblyOptions = element
          .Element("AssemblyOptions")
          ?.Elements()
          .Select(item => item.Int("Vehicle"))
          .ToList()
          ?? new List<int>();
      }
    }

    [Adapter]
    class Shipyard : Building {
      [Nullable]
      [Element("Maintenance")]
      public MaintenanceData? maintenance;
      [Nullable]
      [Element("Electric")]
      public ElectricData? electric;
      [Nullable]
      [Element("Shipyard")]
      public ShipyardData? shipyard;

      public Shipyard(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
