using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class SlotData : BaseAssetObject {
      public string type;
      public int workArea;
      public bool snapsToSlot;
      public int category;

      public SlotData(XElement element) : base(element) {
        this.type = element.String("SlotType");
        this.workArea = element.Int("WorkArea");
        this.snapsToSlot = element.Boolean("SnapsToSlot");
        this.category = element.Int("SlotCategoryName");
      }
    }

    [Adapter]
    class Slot : Building {
      public SlotData? slot;

      public Slot(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.slot = values.Object<SlotData>("Slot");
      }
    }
  }
}
