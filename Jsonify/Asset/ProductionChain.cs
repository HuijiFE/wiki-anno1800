using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ProductionChainNode : BaseAssetObject {
      static List<string> tiers = Enumerable.Range(1, 10).Select(i => $"Tier{i}").ToList();

      public int building;
      public List<ProductionChainNode>? nodes;

      public ProductionChainNode(XElement elem) : base(elem) {
        this.building = elem.Int("Building");
        this.nodes = elem
          .Elements()
          .ToList()
          .Find(e => tiers.Contains(e.Name.ToString()))
          ?.Elements()
          .Select(item => new ProductionChainNode(item))
          .ToList();
      }
    }

    [Adapter]
    class ProductionChain : Asset {
      public ProductionChainNode? chain;

      public ProductionChain(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.chain = values.Object<ProductionChainNode>("ProductionChain");
      }
    }
  }
}
