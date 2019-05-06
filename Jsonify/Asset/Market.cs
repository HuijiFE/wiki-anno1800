using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class MarketData : BaseAssetObject {
      [Element("FullSupplyDistance")]
      public int fullSupplyDistance;
      [Element("NoSupplyDistance")]
      public int noSupplyDistance;

      public MarketData(XElement element) : base(element) { }
    }

    [Adapter]
    class Market : Building {
      [Nullable]
      [Element("Market")]
      public MarketData? market;
      public List<int> storedProducts;

      public Market(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.storedProducts = values
          .ElementByPath("StorageBase/StoredProducts")
          ?.Elements()
          .Select(item => item.Int("Product"))
          .ToList()
          ?? new List<int>();
      }
    }
  }
}
