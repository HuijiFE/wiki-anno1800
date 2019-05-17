using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class RepairCraneData : BaseAssetObject {
      [Element("HealRadius")]
      public int healRadius;
      [Element("HealPerMinute")]
      public int healPerMinute;
      [Element("HealBuildingsPerMinute")]
      public int healBuildingsPerMinute;

      public RepairCraneData(XElement element) : base(element) { }
    }

    [Adapter]
    class RepairCrane : Building {
      [Nullable]
      [Element("RepairCrane")]
      public RepairCraneData? repairCrane;

      public RepairCrane(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
