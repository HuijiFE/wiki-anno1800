using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

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
      [Nullable]
      [Element("ProductionChain")]
      public ProductionChainNode? chain;

      public ProductionChain(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    class ProductData : BaseAssetObject {
      [Element("CanBeNegative")]
      public bool negative;
      [Element("ProductCategory")]
      public int category;
      [Element("IsWorkforce")]
      public bool isWorkforce;
      [Element("IsAbstract")]
      public bool isAbstract;
      public List<string> regions;
      [Element("BasePrice")]
      public int basePrice;
      [Element("CivLevel")]
      public int civLevel;

      public ProductData(XElement element) : base(element) {
        this.regions = element.Element("AssociatedRegion")?.Value.Split(";").ToList() ?? new List<string>();
      }
    }

    class ExpeditionAttributePair : BaseAssetObject {
      [Element("Attribute")]
      public string attribute;
      [Element("Amount")]
      public int amount;

      public ExpeditionAttributePair(XElement element) : base(element) { }
    }

    class ExpeditionAttribute : BaseAssetObject {
      public List<ExpeditionAttributePair> attributes;
      [Element("BaseMorale")]
      public double baseMorale;
      [Element("FluffText")]
      public int fluff;
      [Element("ItemDifficulties")]
      public List<string> itemDifficulties;
      [Element("ItemRegions")]
      public List<string> itemRegions;

      public ExpeditionAttribute(XElement element) : base(element) {
        this.attributes = element
          .Element("ExpeditionAttributes")
          ?.Elements()
          .Select(item => new ExpeditionAttributePair(item))
          .ToList()
          ?? new List<ExpeditionAttributePair>();
      }
    }

    [Adapter]
    class Product : Asset {
      [Nullable]
      [Element("Product")]
      public ProductData? product;
      [Nullable]
      [Element("ExpeditionAttribute")]
      public ExpeditionAttribute? expeditionAttribute;

      public Product(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
