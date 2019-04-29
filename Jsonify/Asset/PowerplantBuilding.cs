using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    [Adapter]
    class PowerplantBuilding : FactoryBuilding7 {


      public PowerplantBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {

      }
    }
  }
}
