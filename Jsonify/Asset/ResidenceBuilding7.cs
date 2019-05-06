using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class Residence7 : BaseAssetObject {
      [Element("PopulationLevel7")]
      public int population;
      [Element("ResidentMax")]
      public int max;

      public Residence7(XElement element) : base(element) { }
    }

    [Adapter]
    class ResidenceBuilding7 : Building {
      [Nullable]
      [Element("Upgradable")]
      public UpgradableData? upgradable;
      [Nullable]
      [Element("Residence7")]
      public Residence7? residnece7;

      public ResidenceBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
