using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class RegionData : BaseAssetObject {
      [Element("PopulationGroup")]
      public int populationGroup;
      public List<int> cityNames;
      public List<int> shipNames;

      public RegionData(XElement element) : base(element) {
        this.cityNames = element.ListOf("CityNames", item => item.Int("Name"));
        this.shipNames = element.ListOf("ShipNames", item => item.Int("Name"));
      }
    }

    [Adapter]
    class Region : Asset {
      [Element("Region")]
      public RegionData region;

      public Region(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
