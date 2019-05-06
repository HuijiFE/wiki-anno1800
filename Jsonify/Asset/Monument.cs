using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class MonumentData : BaseAssetObject {
      [Element("UpgradeTarget")]
      public int upgradeTarget;

      public MonumentData(XElement element) : base(element) { }
    }

    [Adapter]
    class Monument : FactoryBuilding7 {
      [Nullable]
      [Element("Monument")]
      public MonumentData? monument;

      public Monument(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
