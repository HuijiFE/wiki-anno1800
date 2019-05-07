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
      public List<string> types;

      public ItemCategory(XElement element) : base(element) {
        this.types = (element.String("ItemTypes") ?? "").Split(';').ToList();
      }
    }

    class ItemFilterData : BaseAssetObject {
      public List<ItemCategory> categories;

      public ItemFilterData(XElement element) : base(element) {
        this.categories = element
          .Element("ItemCategories")
          ?.Elements()
          .Select(item => new ItemCategory(item))
          .ToList()
          ?? new List<ItemCategory>();
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
        this.products = element
          .Element("Products")
          .Elements()
          .Select(item => item.Int("Product"))
          .ToList();
      }
    }

    class ProductFilterData : BaseAssetObject {
      public List<ProductCategory> categories;

      public ProductFilterData(XElement element) : base(element) {
        this.categories = element
          .Element("Categories")
          ?.Elements()
          .Select(item => new ProductCategory(item))
          .ToList()
          ?? new List<ProductCategory>();
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
