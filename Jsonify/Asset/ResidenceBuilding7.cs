using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class Residence7 : BaseAssetObject {
      public int population;
      public int max;

      public Residence7(XElement element) : base(element) {
        this.population = element.Int("PopulationLevel7");
        this.max = element.Int("ResidentMax");
      }
    }

    [Adapter]
    class ResidenceBuilding7 : Building {
      [Nullable]
      public UpgradableData? upgradable;
      [Nullable]
      public Residence7? residnece7;

      public ResidenceBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.upgradable = values.Object<UpgradableData>("Upgradable");
        this.residnece7 = values.Object<Residence7>("Residence7");
      }
    }
  }
}
