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

      public CostPair(XElement element) : base(element) {
        this.ingredient = element.Int("Ingredient");
        this.amount = element.Int("Amount");
      }
    }

    class CostData : BaseAssetObject {
      public List<CostPair> costs;

      public CostData(XElement element) : base(element) {
        this.costs = element
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
      public double shutdownThreshold;

      public MaintenancePair(XElement element) : base(element) {
        this.product = element.Int("Product");
        this.amount = element.Int("Amount");
        this.inactiveAmount = element.Int("InactiveAmount");
        this.shutdownThreshold = element.Double("ShutdownThreshold");
      }
    }

    class MaintenanceData : BaseAssetObject {
      public List<MaintenancePair> maintenances;
      public int consumerPriority;

      public MaintenanceData(XElement element) : base(element) {
        this.maintenances = element
          .Element("Maintenances")
          ?.Elements()
          .Select(item => new MaintenancePair(item))
          .ToList()
          ?? new List<MaintenancePair>();
        this.consumerPriority = element.Int("ConsumerPriority");
      }
    }
  }
}
