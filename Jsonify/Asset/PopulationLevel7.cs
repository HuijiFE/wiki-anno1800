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

      public PopulationInput(XElement element) : base(element) {
        this.product = element.Int("Product");
        this.amount = element.Double("Amount");
        this.supply = element.Int("SupplyWeight");
        this.happiness = element.Int("HappinessValue");
        this.mouney = element.Int("MoneyValue");
        this.full = element.Int("FullWeightPopulationCount");
        this.no = element.Int("NoWeightPopulationCount");
      }
    }

    class PopulationOutput : BaseAssetObject {
      public int product;
      public int amount;

      public PopulationOutput(XElement element) : base(element) {
        this.product = element.Int("Product");
        this.amount = element.Int("Amount");
      }
    }

    class MoodText : BaseAssetObject {
      public int angry;
      public int unhappy;
      public int neutral;
      public int happy;
      public int euphoric;

      public MoodText(XElement element) : base(element) {
        this.angry = element.Int("Angry/Text");
        this.unhappy = element.Int("Unhappy/Text");
        this.neutral = element.Int("Neutral/Text");
        this.happy = element.Int("Happy/Text");
        this.euphoric = element.Int("Euphoric/Text");
      }
    }

    class Population7 : BaseAssetObject {
      public List<PopulationInput> inputs;
      public List<PopulationOutput> outputs;
      public string? categoryIcon;
      [Nullable]
      public MoodText? moods;

      public Population7(XElement element) : base(element) {
        this.inputs = element
          .Element("PopulationInputs")
          ?.Elements()
          .Select(item => new PopulationInput(item))
          .ToList()
          ?? new List<PopulationInput>();
        this.outputs = element
          .Element("PopulationOutputs")
          ?.Elements()
          .Where(item => item.Element("Amount") != null)
          .Select(item => new PopulationOutput(item))
          .ToList()
          ?? new List<PopulationOutput>();

        this.categoryIcon = element.String("CategoryIcon");
        this.moods = element.Object<MoodText>("MoodText");
      }
    }

    [Adapter]
    class PopulationLevel7 : Asset {
      [Nullable]
      public Population7? population7;

      public PopulationLevel7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        this.population7 = asset.Object<Population7>("Values/PopulationLevel7");
      }
    }
  }
}
