using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class PopulationInput : BaseAssetObject {
      public int product;
      public double amount;
      public int supply;
      public int happiness;
      public int mouney;
      public int full;
      public int no;

      public PopulationInput(XElement elem) : base(elem) {
        this.product = elem.Int("Product");
        this.amount = elem.Double("Amount");
        this.supply = elem.Int("SupplyWeight");
        this.happiness = elem.Int("HappinessValue");
        this.mouney = elem.Int("MoneyValue");
        this.full = elem.Int("FullWeightPopulationCount");
        this.no = elem.Int("NoWeightPopulationCount");
      }
    }

    class PopulationOutput : BaseAssetObject {
      public int product;
      public int amount;

      public PopulationOutput(XElement elem) : base(elem) {
        this.product = elem.Int("Product");
        this.amount = elem.Int("Amount");
      }
    }

    class MoodText : BaseAssetObject {
      public int angry;
      public int unhappy;
      public int neutral;
      public int happy;
      public int euphoric;

      public MoodText(XElement elem) : base(elem) {
        this.angry = elem.Int("Angry/Text");
        this.unhappy = elem.Int("Unhappy/Text");
        this.neutral = elem.Int("Neutral/Text");
        this.happy = elem.Int("Happy/Text");
        this.euphoric = elem.Int("Euphoric/Text");
      }
    }

    class Population7 : BaseAssetObject {
      public List<PopulationInput> inputs;
      public List<PopulationOutput> outputs;
      public string? categoryIcon;
      public MoodText? moods;

      public Population7(XElement elem) : base(elem) {
        this.inputs = elem
          .Element("PopulationInputs")
          ?.Elements()
          .Select(item => new PopulationInput(item))
          .ToList()
          ?? new List<PopulationInput>();
        this.outputs = elem
          .Element("PopulationOutputs")
          ?.Elements()
          .Where(item => item.Element("Amount") != null)
          .Select(item => new PopulationOutput(item))
          .ToList()
          ?? new List<PopulationOutput>();

        this.categoryIcon = elem.String("CategoryIcon");
        this.moods = elem.Object<MoodText>("MoodText");
      }
    }

    [Adapter]
    class PopulationLevel7 : Asset {
      public Population7? population7;

      public PopulationLevel7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        this.population7 = asset.Object<Population7>("Values/PopulationLevel7");
      }
    }
  }
}
