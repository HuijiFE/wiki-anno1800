using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class SlotData : BaseAssetObject {
      [Element("SlotType")]
      public string type;
      [Element("WorkArea")]
      public int workArea;
      [Element("SnapsToSlot")]
      public bool snapsToSlot;
      [Element("SlotCategoryName")]
      public int category;

      public SlotData(XElement element) : base(element) { }
    }

    [Adapter]
    class Slot : Building {
      [Nullable]
      [Element("Slot")]
      public SlotData? slot;

      public Slot(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
