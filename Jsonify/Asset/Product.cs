using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

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

    [Adapter]
    class Product : Asset {
      [Nullable]
      [Element("Product")]
      public ProductData? product;

      public Product(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
