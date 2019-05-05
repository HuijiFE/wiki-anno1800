using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class StreetData : BaseAssetObject {
      public int bridge;

      public StreetData(XElement element) : base(element) {
        this.bridge = element.Int("BridgeAsset");
      }
    }

    [Adapter]
    class Street : Building {
      [Nullable]
      public StreetData? street;

      public Street(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.street = values.Object<StreetData>("Street");
      }
    }
  }
}
