using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    [Adapter]
    class SlotFactoryBuilding7 : FactoryBuilding7 {
      public SlotData? slot;

      public SlotFactoryBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.slot = values.Object<SlotData>("Slot");
      }
    }
  }
}
