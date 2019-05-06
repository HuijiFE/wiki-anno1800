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
  }
}
