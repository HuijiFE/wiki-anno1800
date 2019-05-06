using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class StreetData : BaseAssetObject {
      [Element("BridgeAsset")]
      public int bridge;

      public StreetData(XElement element) : base(element) { }
    }

    [Adapter]
    class Street : Building {
      [Nullable]
      [Element("Street")]
      public StreetData? street;

      public Street(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class StreetBuilding : Street {
      public StreetBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

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
