using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ColorConfigData : BaseAssetObject {
      public Dictionary<string, string> text;
      public Dictionary<string, string> slotGhost;
      public Dictionary<string, string> questOutline;
      public Dictionary<string, string> itemRarity;
      [Color]
      [Element("BuildModeCurrentValidColor")]
      public string buildModeCurrentValidColor;
      [Color]
      [Element("BuildModeCurrentInvalidColor")]
      public string buildModeCurrentInvalidColor;
      [Color]
      [Element("PositiveValueColor")]
      public string positiveValueColor;
      [Color]
      [Element("NegativeValueColor")]
      public string negativeValueColor;
      [Color]
      [Element("BuildModeRadius")]
      public string buildModeRadius;
      [Color]
      [Element("BuildModeGridExtension")]
      public string buildModeGridExtension;
      [Color]
      [Element("BlueprintColor")]
      public string blueprintColor;

      static Dictionary<string, string> GetColorDict(XElement element) {
        return element.Elements().ToDictionary(el => el.Name.ToString(), el => el.Color("Color"));
      }

      public ColorConfigData(XElement element) : base(element) {
        this.text = GetColorDict(element.Element("TextColors"));
        this.slotGhost = GetColorDict(element.Element("SlotGhostColor"));
        this.questOutline = GetColorDict(element.Element("QuestOutlineColor"));
        this.itemRarity = GetColorDict(element.Element("ItemRarityColors"));
      }
    }

    [Adapter]
    class ColorConfig : Building {
      [Nullable]
      [Element("ColorConfig")]
      public ColorConfigData? colorConfig;

      public ColorConfig(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
