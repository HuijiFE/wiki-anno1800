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

      public Residence7(XElement elem) : base(elem) {
        this.population = elem.Int("PopulationLevel7");
        this.max = elem.Int("ResidentMax");
      }
    }

    [Adapter]
    class ResidenceBuilding7 : Building {
      public Residence7 residnece7;

      public ResidenceBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        this.residnece7 = asset.Object<Residence7>("Values/Residence7");
      }
    }
  }
}
