using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class ItemCategory : BaseAssetObject {
      [Element("CategoryAsset")]
      public int category;
      [Element("ItemTypes")]
      public List<string> types;

      public ItemCategory(XElement element) : base(element) { }
    }

    class ItemFilterData : BaseAssetObject {
      public List<ItemCategory> categories;

      public ItemFilterData(XElement element) : base(element) {
        this.categories = element.ListOf("ItemCategories", item => new ItemCategory(item));
      }
    }

    [Adapter]
    class ItemFilter : Asset {
      [Nullable]
      [Element("ItemFilter")]
      public ItemFilterData? itemFilter;

      public ItemFilter(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    class ProductCategory : BaseAssetObject {
      [Element("CategoryAsset")]
      public int category;
      public List<int> products;

      public ProductCategory(XElement element) : base(element) {
        this.products = element.ListOf("Products", item => item.Int("Product"));
      }
    }

    class ProductFilterData : BaseAssetObject {
      public List<ProductCategory> categories;

      public ProductFilterData(XElement element) : base(element) {
        this.categories = element.ListOf("Categories", item => new ProductCategory(item));
      }
    }

    [Adapter]
    class ProductFilter : Asset {
      [Nullable]
      [Element("ProductFilter")]
      public ProductFilterData? productFilter;

      public ProductFilter(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
