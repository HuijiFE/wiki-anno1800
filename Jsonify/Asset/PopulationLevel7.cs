using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class PopulationInput : BaseAssetObject {
      [Element("Product")]
      public int product;
      [Element("Amount")]
      public double amount;
      [Element("SupplyWeight")]
      public int supply;
      [Element("HappinessValue")]
      public int happiness;
      [Element("MoneyValue")]
      public int mouney;
      [Element("FullWeightPopulationCount")]
      public int full;
      [Element("NoWeightPopulationCount")]
      public int no;

      public PopulationInput(XElement element) : base(element) { }
    }

    class PopulationOutput : BaseAssetObject {
      [Element("Product")]
      public int product;
      [Element("Amount")]
      public int amount;

      public PopulationOutput(XElement element) : base(element) { }
    }

    class Population7 : BaseAssetObject {
      public List<PopulationInput> inputs;
      public List<PopulationOutput> outputs;
      [Element("CategoryIcon")]
      public string categoryIcon;
      [Nullable]
      public Dictionary<string, int> moods;

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

        this.moods = element
          .Element("MoodText")
          .Elements()
          .ToDictionary(el => el.Name.ToString(), el => el.Int("Text"));
      }
    }

    [Adapter]
    class PopulationLevel7 : Asset {
      [Nullable]
      [Element("PopulationLevel7")]
      public Population7? population7;

      public PopulationLevel7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
