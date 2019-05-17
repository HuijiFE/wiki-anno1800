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
      public List<string> regions;
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
      [Element("Building")]
      public BuildingData building;
      [Nullable]
      [Element("Cost")]
      public CostData? cost;
      [Nullable]
      [Element("Maintenance")]
      public MaintenanceData? maintenance;

      public Building(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // ================================
    // Upgradable

    class UpgradableData : BaseAssetObject {
      [Element("NextGUID")]
      public int next;
      public List<CostPair> costs;

      public UpgradableData(XElement element) : base(element) {
        this.costs = element.ListOf("UpgradeCost", item => new CostPair(item));
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
      public List<List<int>> setPages;
      [Element("OpenSetPages")]
      public int openSetPages;

      public CultureData(XElement element) : base(element) {
        this.setPages = element.ListOf("SetPages", item => item.ListOf("Page", item => item.Int("Set"), item => item.Int("Set") > 0));
      }
    }
  }
}
