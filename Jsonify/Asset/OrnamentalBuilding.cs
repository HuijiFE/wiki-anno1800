using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class OrnamentData : BaseAssetObject {
      [Element("OrnamentUnit")]
      public int unit;
      [Element("OrnamentDescritpion")]
      public int description;

      public OrnamentData(XElement element) : base(element) { }
    }

    [Adapter]
    class OrnamentalBuilding : Building {
      [Nullable]
      [Element("Ornament")]
      public OrnamentData? ornament;

      public OrnamentalBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class BuildPermitBuilding : OrnamentalBuilding {
      public BuildPermitBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
