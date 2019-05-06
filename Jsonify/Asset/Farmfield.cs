using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    [Adapter]
    class Farmfield : Building {
      public Farmfield(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
