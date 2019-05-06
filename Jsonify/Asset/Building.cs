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

    class Building : Asset {
      [Nullable]
      public AttackableData? attackable;
      [Nullable]
      public BuildingData? building;
      [Nullable]
      public CostData? cost;

      public Building(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.attackable = values.Object<AttackableData>("Attackable");
        this.building = values.Object<BuildingData>("Building");
        this.cost = values.Object<CostData>("Cost");
      }
    }

    // ================================
    // Upgradable

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

    // ================================
    // Culture

    class CultureData : BaseAssetObject {
      public string type;
      public int attractiveness;
      public bool hasPollution;
      //public bool cultureSpawnGroup;
      public List<int> setPages;
      public int openSetPages;

      public CultureData(XElement element) : base(element) {
        this.type = element.String("CultureType") ?? "";
        this.attractiveness = element.Int("Attractiveness");
        this.hasPollution = element.Boolean("HasPollution");
        //this.cultureSpawnGroup = element.Boolean("CultureSpawnGroup");
        this.setPages = element
          .Element("SetPages")
          ?.Elements()
          .Select(item => item.Element("Page")?.Elements())
          .Aggregate((agg, cur) => agg.Concat(cur))
          .Select(item => item.Int("Set"))
          .ToList()
          ?? new List<int>();
        this.openSetPages = element.Int("OpenSetPages");
      }
    }

    // ================================
    // ModuleOwner

    class ModuleOwnerData : BaseAssetObject {
      public List<int> options;
      public int limit;
      public int radius;

      public ModuleOwnerData(XElement element) : base(element) {
        this.options = element
          .Element("ConstructionOptions")
          ?.Elements()
          .Select(item => item.Int("ModuleGUID"))
          .ToList()
          ?? new List<int>();
        this.limit = element.Int("ModuleLimit");
        this.radius = element.Int("ModuleBuildRadius");
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
