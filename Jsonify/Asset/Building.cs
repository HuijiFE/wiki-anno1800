using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class BuildingData : BaseAssetObject {
      public string? type;
      public string? terrian;
      public string? region;
      public int? category;

      public BuildingData(XElement element) : base(element) {
        this.type = element.String("BuildingType");
        this.terrian = element.String("TerrainType");
        this.region = element.String("AssociatedRegions");
        this.category = element.Int("BuildingCategoryName");
      }
    }

    class UpgradableData : BaseAssetObject {
      public int next;
      public List<CostPair> costs;

      public UpgradableData(XElement element) : base(element) {
        this.next = element.Int("NextGUID");
        this.costs = element.Element("UpgradeCost")
          .Elements()
          .Select(item => new CostPair(item))
          .ToList()
          ?? new List<CostPair>();
      }
    }

    class Building : Asset {
      public BuildingData? building;
      public CostData? cost;
      public UpgradableData? upgradable;
      public MaintenanceData? maintenance;

      public Building(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.building = values.Object<BuildingData>("Building");
        this.cost = values.Object<CostData>("Cost");
        this.upgradable = values.Object<UpgradableData>("Upgradable");
        this.maintenance = values.Object<MaintenanceData>("Maintenance");
      }
    }

    // ================================
    // Culture

    class CultureData : BaseAssetObject {
      public string type;
      public int attractiveness;
      public bool hasPollution;

      public CultureData(XElement element) : base(element) {
        this.type = element.String("CultureType") ?? "";
        this.attractiveness = element.Int("Attractiveness");
        this.hasPollution = element.Boolean("HasPollution");
      }
    }

    // ================================
    // Electric

    class ElectricData : BaseAssetObject {
      public bool boost;
      public bool mandatory;

      public ElectricData(XElement element) : base(element) {
        this.boost = element.Boolean("BoostedByElectricity") || element.Boolean("ProductivityBoost");
        this.mandatory = element.Boolean("MandatoryElectricity");
      }
    }
  }
}
