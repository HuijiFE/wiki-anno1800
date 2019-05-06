using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class BridgeData : BaseAssetObject {
      [Element("MinLength")]
      public int minLength;
      [Element("MaxLength")]
      public int maxLength;

      public BridgeData(XElement element) : base(element) { }
    }

    [Adapter]
    class BridgeBuilding : Building {
      [Nullable]
      [Element("Bridge")]
      public BridgeData? bridge;

      public BridgeBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
