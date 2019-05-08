using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class BuildingData : BaseAssetObject {
      [Element("BuildingType")]
      public string type;
      [Element("TerrainType")]
      public string terrian;
      [Element("AssociatedRegions")]
      public string region;
      [Element("BuildingCategoryName")]
      public int category;
      [Element("PickingAsset")]
      public int pickingAsset;

      public BuildingData(XElement element) : base(element) { }
    }

    class Building : Asset {
      [Nullable]
      [Element("Attackable")]
      public AttackableData? attackable;
      [Nullable]
      [Element("Building")]
      public BuildingData? building;
      [Nullable]
      [Element("Cost")]
      public CostData? cost;

      public Building(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // ================================
    // Upgradable

    class UpgradableData : BaseAssetObject {
      [Element("NextGUID")]
      public int next;
      public List<CostPair> costs;

      public UpgradableData(XElement element) : base(element) {
        this.costs = element.Element("UpgradeCost")
          ?.Elements()
          .Select(item => new CostPair(item))
          .ToList()
          ?? new List<CostPair>();
      }
    }

    // ================================
    // Culture

    class CultureData : BaseAssetObject {
      [Element("CultureType")]
      public string type;
      [Element("Attractiveness")]
      public int attractiveness;
      [Element("HasPollution")]
      public bool hasPollution;
      //[Element("CultureSpawnGroup")]
      //public bool cultureSpawnGroup;
      public List<int> setPages;
      [Element("OpenSetPages")]
      public int openSetPages;

      public CultureData(XElement element) : base(element) {
        this.setPages = element
          .Element("SetPages")
          ?.Elements()
          .Select(item => item.Element("Page")?.Elements())
          .Aggregate((agg, cur) => agg.Concat(cur))
          .Select(item => item.Int("Set"))
          .ToList()
          ?? new List<int>();
      }
    }
  }
}
