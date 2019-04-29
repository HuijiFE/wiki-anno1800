using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class MonumentData : BaseAssetObject {
      public int upgradeTarget;

      public MonumentData(XElement element) : base(element) {
        this.upgradeTarget = element.Int("UpgradeTarget");
      }
    }

    [Adapter]
    class Monument : FactoryBuilding7 {
      public MonumentData? monument;

      public Monument(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.monument = values.Object<MonumentData>("Monument");
      }
    }
  }
}
