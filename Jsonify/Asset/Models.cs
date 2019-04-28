using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    // ================================
    // Cost

    class CostPair : BaseAssetObject {
      public int ingredient;
      public int amount;

      public CostPair(XElement elem) : base(elem) {
        this.ingredient = elem.Int("Ingredient");
        this.amount = elem.Int("Amount");
      }
    }

    class CostData : BaseAssetObject {
      public List<CostPair> costs;

      public CostData(XElement elem) : base(elem) {
        this.costs = elem
          .Element("Costs")
          ?.Elements()
          .Where(item => item.String("Amount") != null)
          .Select(item => new CostPair(item))
          .ToList()
          ?? new List<CostPair>();
      }
    }

    // ================================
    // Maintenance

    class MaintenancePair {
      public int product;
      public int amount;
    }
  }
}
