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
      public string buildModeCurrentValidColor;
      public string buildModeCurrentInvalidColor;
      public string positiveValueColor;
      public string negativeValueColor;
      public string buildModeRadius;
      public string buildModeGridExtension;
      public string blueprintColor;

      static Dictionary<string, string> GetColorDict(XElement element) {
        return element.Elements().ToDictionary(el => el.Name.ToString(), el => el.Color("Color"));
      }

      public ColorConfigData(XElement element) : base(element) {
        this.text = GetColorDict(element.Element("TextColors"));
        this.slotGhost = GetColorDict(element.Element("SlotGhostColor"));
        this.questOutline = GetColorDict(element.Element("QuestOutlineColor"));
        this.itemRarity = GetColorDict(element.Element("ItemRarityColors"));
        this.buildModeCurrentValidColor = element.Color("BuildModeCurrentValidColor");
        this.buildModeCurrentInvalidColor = element.Color("BuildModeCurrentInvalidColor");
        this.positiveValueColor = element.Color("PositiveValueColor");
        this.negativeValueColor = element.Color("NegativeValueColor");
        this.buildModeRadius = element.Color("BuildModeRadius");
        this.buildModeGridExtension = element.Color("BuildModeGridExtension");
        this.blueprintColor = element.Color("BlueprintColor");
      }
    }

    [Adapter]
    class ColorConfig : Building {
      [Nullable]
      public ColorConfigData? colorConfig;

      public ColorConfig(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.colorConfig = values.Object<ColorConfigData>("ColorConfig");
      }
    }
  }
}
