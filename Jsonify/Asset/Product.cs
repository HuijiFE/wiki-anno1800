using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ProductData : BaseAssetObject {
      public ProductData(XElement elem) : base(elem) {

      }
    }

    class Product : Asset {

      public Product(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
      }
    }
  }
}
