using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    [Adapter]
    class Fertility : Asset {
      public Fertility(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    class ResourceSetCondition : BaseAssetObject {
      [Element("Priority")]
      public int priority;
      [Element("AllowedRegion")]
      public string allowedRegion;
      [Element("AllowedIslandType")]
      public List<string> allowedIslandType;
      [Element("AllowedIslandDifficulty")]
      public List<string> allowedIslandDifficulty;
      [Element("AllowedResourceAmounts")]
      public List<string> allowedResourceAmounts;

      public ResourceSetCondition(XElement element) : base(element) { }
    }

    class ResourceSet : Asset {
      [Nullable]
      [NonEmptyElement]
      [Element("ResourceSetCondition")]
      public ResourceSetCondition? resourceSetCondition;

      public ResourceSet(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class FertilitySet : ResourceSet {
      public List<int> fertilities;
      public FertilitySet(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.fertilities = values.ListOf("FertilitySet/Fertilities", item => item.Int("Fertility"));
      }
    }

    [Adapter]
    class MineSlotSet : ResourceSet {
      public List<int> mineSlots;
      public MineSlotSet(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.mineSlots = values.ListOf("MineSlotResourceSet/MineSlots", item => item.Int("MineSlot"));
      }
    }
  }
}
