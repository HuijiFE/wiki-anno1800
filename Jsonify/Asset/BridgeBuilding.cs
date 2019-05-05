using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class BridgeData : BaseAssetObject {
      public int minLength;
      public int maxLength;

      public BridgeData(XElement element) : base(element) {
        this.minLength = element.Int("MinLength");
        this.maxLength = element.Int("MaxLength");
      }
    }

    [Adapter]
    class BridgeBuilding : Building {
      [Nullable]
      public BridgeData bridge;

      public BridgeBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.bridge = values.Object<BridgeData>("Bridge");
      }
    }
  }
}
