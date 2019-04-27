using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class ResidenceBuilding7 : Asset {
      BuildingData building;

      public ResidenceBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        this.building = Asset.GetBuildingData(asset.Element("Building"));
      }
    }
  }
}
