using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    // Construction Menu ================

    class CategoryMode : BaseAssetObject {
      public List<int> tierCategories;
      public List<int> buildingCategories;

      public CategoryMode(XElement element) : base(element) {
        this.tierCategories = element.ListOf("Tier/Categories", item => item.Int("Category"));
        this.buildingCategories = element.ListOf("BuildingCategory/Categories", item => item.Int("Category"));
      }
    }

    class ConstructionMenuData : BaseAssetObject {
      public Dictionary<string, CategoryMode> regionMenu;

      public ConstructionMenuData(XElement element) : base(element) {
        this.regionMenu = element.DictionaryOf(
          "RegionMenu",
          item => item.Name.ToString(),
          item => new CategoryMode(item.Element("CategoryMode"))
          );
      }
    }

    [Adapter]
    class ConstructionMenu : Asset {
      [Element("ConstructionMenu")]
      public ConstructionMenuData constructionMenu;

      public ConstructionMenu(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // Construction Category ================

    class ConstructionCategoryData : BaseAssetObject {
      [Element("CategoryDescription")]
      public int description;
      public List<int> buildingList;

      public ConstructionCategoryData(XElement element) : base(element) {
        this.buildingList = element.ListOf("BuildingList", item => item.Int("Building"));
      }
    }

    [Adapter]
    class ConstructionCategory : Asset {
      [Element("ConstructionCategory")]
      public ConstructionCategoryData constructionCategory;

      public ConstructionCategory(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // Production Chain ================

    class ProductionChainNode : BaseAssetObject {
      [Element("Building")]
      public int building;
      [Nullable]
      public List<ProductionChainNode>? nodes;

      public ProductionChainNode(XElement element) : base(element) {
        this.nodes = element
          .Elements()
          .ToList()
          .Find(e => e.Name.ToString().StartsWith("Tier"))
          ?.Elements()
          .Select(item => new ProductionChainNode(item))
          .ToList();
      }
    }

    [Adapter]
    class ProductionChain : Asset {
      [Element("ProductionChain")]
      public ProductionChainNode chain;

      public ProductionChain(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
