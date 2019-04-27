using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class BuildingData {

    }

    static BuildingData GetBuildingData(XElement building) {
      return new BuildingData();
    }
  }
}
