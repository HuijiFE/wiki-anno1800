using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    [Adapter]
    class FarmBuilding : FactoryBuilding7 {
      [Nullable]
      public ModuleOwnerData? moduleOwner;

      public FarmBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.moduleOwner = values.Object<ModuleOwnerData>("ModuleOwner");
      }
    }
  }
}
