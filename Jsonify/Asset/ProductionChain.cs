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
      [Nullable]
      public List<ProductionChainNode>? nodes;

      public ProductionChainNode(XElement element) : base(element) {
        this.building = element.Int("Building");
        this.nodes = element
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
      [Nullable]
      public ProductionChainNode? chain;

      public ProductionChain(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.chain = values.Object<ProductionChainNode>("ProductionChain");
      }
    }
  }
}
