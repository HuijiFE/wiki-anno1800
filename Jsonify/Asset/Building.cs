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

      public BuildingData(XElement elem) : base(elem) {
        this.type = elem.String("BuildingType");
        this.terrian = elem.String("TerrainType");
        this.region = elem.String("AssociatedRegions");
        this.category = elem.Int("BuildingCategoryName");
      }
    }

    class UpgradableData : BaseAssetObject {
      public int next;
      public List<CostPair> costs;

      public UpgradableData(XElement elem) : base(elem) {
        this.next = elem.Int("NextGUID");
        this.costs = elem.Element("UpgradeCost")
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
      public bool construtable;

      public Building(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.building = values.Object<BuildingData>("Building");
        this.cost = values.Object<CostData>("Cost");
        this.upgradable = values.Object<UpgradableData>("Upgradable");
        this.construtable = values.Element("Constructable") != null;
      }
    }
  }
}
