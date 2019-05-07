using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    //[Adapter]
    class Text : Asset {
      public Text(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

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

    [Adapter]
    class PlayerLogo : Asset {
      [Element("PlayerLogo/DefaultLogo")]
      public string defaultLogo;
      [Element("PlayerLogo/MiniLogo")]
      public string miniLogo;

      public PlayerLogo(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
