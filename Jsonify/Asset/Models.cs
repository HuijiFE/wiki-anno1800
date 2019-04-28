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

    class MaintenancePair : BaseAssetObject {
      public int product;
      public int amount;
      public int inactiveAmount;

      public MaintenancePair(XElement elem) : base(elem) {
        this.product = elem.Int("Product");
        this.amount = elem.Int("Amount");
        this.inactiveAmount = elem.Int("InactiveAmount");
      }
    }

    class MaintenanceData : BaseAssetObject {
      public List<MaintenancePair> maintenances;
      public int consumerPriority;

      public MaintenanceData(XElement elem) : base(elem) {
        this.maintenances = elem
          .Element("Maintenances")
          ?.Elements()
          .Select(item => new MaintenancePair(item))
          .ToList()
          ?? new List<MaintenancePair>();
        this.consumerPriority = elem.Int("ConsumerPriority");
      }
    }

    // ================================
    // Electric

    class ElectricData : BaseAssetObject {
      public bool boosted;
      public bool mandatory;

      public ElectricData(XElement element) : base(element) {
        this.boosted = element.Boolean("BoostedByElectricity");
        this.mandatory = element.Boolean("MandatoryElectricity");
      }
    }
  }
}
