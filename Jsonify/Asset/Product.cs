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
      public int basePrice;
      public int civLevel;

      public ProductData(XElement element) : base(element) {
        this.negative = element.Boolean("CanBeNegative");
        this.category = element.Int("ProductCategory");
        this.isWorkforce = element.Boolean("IsWorkforce");
        this.isAbstract = element.Boolean("IsAbstract");
        this.regions = element.Element("AssociatedRegion")?.Value.Split(";").ToList();
        this.basePrice = element.Int("BasePrice");
        this.civLevel = element.Int("CivLevel");
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
