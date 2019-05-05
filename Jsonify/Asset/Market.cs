using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class MarketData : BaseAssetObject {
      public int fullSupplyDistance;
      public int noSupplyDistance;

      public MarketData(XElement element) : base(element) {
        this.fullSupplyDistance = element.Int("FullSupplyDistance");
        this.noSupplyDistance = element.Int("NoSupplyDistance");
      }
    }

    [Adapter]
    class Market : Building {
      [Nullable]
      public MarketData? market;
      public List<int> storedProducts;

      public Market(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.market = values.Object<MarketData>("Market");
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
