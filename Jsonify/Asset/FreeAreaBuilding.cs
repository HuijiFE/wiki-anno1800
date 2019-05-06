using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class FreeAreaProductivity : BaseAssetObject {
      [Element("InfluenceRadius")]
      public int radius;
      [Element("NeededAreaPercent")]
      public int neededAreaPercent;
      [Element("WorkerUnit")]
      public int worker;
      [Element("MaxWorkerAmount")]
      public int maxWorkers;
      [Element("WorkerPause")]
      public int workerPause;
      [Element("WayTime")]
      public int wayTime;
      [Element("FreeAreaType")]
      public string freeAreaType;
      [Element("CutTree")]
      public bool cutTree;

      public FreeAreaProductivity(XElement element) : base(element) { }
    }

    [Adapter]
    class FreeAreaBuilding : FactoryBuilding7 {
      [Nullable]
      [Element("FreeAreaProductivity")]
      public FreeAreaProductivity? freeAreaProductivity;

      public FreeAreaBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
