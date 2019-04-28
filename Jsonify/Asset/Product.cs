using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ProductData : BaseAssetObject {
      public bool negative;
      public int category;
      public bool isWorkforce;
      public bool isAbstract;
      public List<string>? regions;
      public int price;
      public int civLevel;

      public ProductData(XElement elem) : base(elem) {
        this.negative = elem.Boolean("CanBeNegative");
        this.category = elem.Int("ProductCategory");
        this.isWorkforce = elem.Boolean("IsWorkforce");
        this.isAbstract = elem.Boolean("IsAbstract");
        this.regions = elem.Element("AssociatedRegion")?.Value.Split(";").ToList();
        this.price = elem.Int("BasePrice");
        this.civLevel = elem.Int("CivLevel");
      }
    }

    [Adapter]
    class Product : Asset {
      public ProductData? product;

      public Product(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.product = values.Object<ProductData>("Product");
      }
    }
  }
}
