using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class ItemCategoryPair : BaseAssetObject {
      [Element("CategoryAsset")]
      public int asset;
      public List<string> types;

      public ItemCategoryPair(XElement element) : base(element) {
        this.types = (element.String("ItemTypes") ?? "").Split(';').ToList();
      }
    }

    class ItemFilterData : BaseAssetObject {
      public List<ItemCategoryPair> categories;

      public ItemFilterData(XElement element) : base(element) {
        this.categories = element
          .Element("ItemCategories")
          ?.Elements()
          .Select(item => new ItemCategoryPair(item))
          .ToList()
          ?? new List<ItemCategoryPair>();
      }
    }

    [Adapter]
    class ItemFilter : Building {
      [Nullable]
      [Element("ItemFilter")]
      public ItemFilterData? itemFilter;

      public ItemFilter(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
