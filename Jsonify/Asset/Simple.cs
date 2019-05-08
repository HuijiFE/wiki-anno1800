using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    // Text ================

    //[Adapter]
    class Text : Asset {
      public Text(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // Icon ================

    [Adapter]
    class Icon : Asset {
      public Icon(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class NewspaperEffectIcon : Icon {
      [Element("NewspaperEffectIcon/EffectColor")]
      public string effectColor;

      public NewspaperEffectIcon(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // PlayerLogo ================

    class PlayerLogoData : BaseAssetObject {
      [Element("DefaultLogo")]
      public string defaultLogo;
      [Element("MiniLogo")]
      public string miniLogo;

      public PlayerLogoData(XElement element) : base(element) { }
    }

    [Adapter]
    class PlayerLogo : Asset {
      [Element("PlayerLogo")]
      public PlayerLogoData playerLogo;

      public PlayerLogo(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // Portrait ================

    class PortraitData : BaseAssetObject {
      [Element("PortraitName")]
      public int name;
      [Color]
      [Element("PortraitColor")]
      public string color;
      [Element("IsFemale")]
      public bool isFemale;

      public PortraitData(XElement element) : base(element) { }
    }

    [Adapter]
    class Portrait : Asset {
      [Element("Portrait")]
      public PortraitData portrait;

      public Portrait(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
