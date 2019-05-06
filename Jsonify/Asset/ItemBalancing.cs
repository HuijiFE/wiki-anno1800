using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ItemConfigData : BaseAssetObject {
      public Dictionary<string, int> rarityText;
      public Dictionary<string, int> exclusiveGroupText;
      public Dictionary<string, int> allocationText;
      public Dictionary<string, string> allocationIcons;
      public int itemGenCrateAsset;
      public double itemGenCrateScale;
      public int buffFluffIndexIncreaseTimer;

      static Dictionary<string, int> GetTextDict(XElement element) {
        return element.Elements().ToDictionary(el => el.Name.ToString(), el => el.Int("Text"));
      }

      public ItemConfigData(XElement element) : base(element) {
        this.rarityText = GetTextDict(element.Element("RarityText"));
        this.exclusiveGroupText = GetTextDict(element.Element("ExclusiveGroupText"));
        this.allocationText = GetTextDict(element.Element("AllocationText"));
        this.allocationIcons = element
          .Element("AllocationIcons")
          .Elements()
          .ToDictionary<XElement, string, string>(el => el.String("Allocation") ?? "", el => el.String("AllocationIcon") ?? "");
        this.itemGenCrateAsset = element.Int("ItemGenCrateAsset");
        this.itemGenCrateScale = element.Double("ItemGenCrateScale");
        this.buffFluffIndexIncreaseTimer = element.Int("BuffFluffIndexIncreaseTimer");
      }
    }

    [Adapter]
    class ItemBalancing : Building {
      [Nullable]
      public ItemConfigData? itemConfig;

      public ItemBalancing(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.itemConfig = values.Object<ItemConfigData>("ItemConfig");
      }
    }
  }
}
