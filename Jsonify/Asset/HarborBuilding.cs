using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class HarborBuilding : Building {
      [Nullable]
      [Element("Culture")]
      public CultureData? culture;

      public HarborBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class HarborBuildingAttacker : HarborBuilding {
      [Nullable]
      [Element("Attacker")]
      public AttackerData attacker;

      public HarborBuildingAttacker(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class VisitorPier : Building {
      public VisitorPier(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class WorkforceConnector : Building {

      public WorkforceConnector(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
