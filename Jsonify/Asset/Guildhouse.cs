using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    [Adapter]
    class Guildhouse : Building {
      [Nullable]
      [Element("IncidentInfluencer")]
      public IncidentInfluencer incidentInfluencer;

      public Guildhouse(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class HarborOffice : Building {
      public HarborOffice(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
