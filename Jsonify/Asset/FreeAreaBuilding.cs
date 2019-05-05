using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class FreeAreaProductivity : BaseAssetObject {
      public int radius;
      public int neededAreaPercent;
      public int worker;
      public int maxWorkers;
      public int workerPause;
      public int wayTime;
      public string? freeAreaType;
      public bool cutTree;

      public FreeAreaProductivity(XElement element) : base(element) {
        this.radius = element.Int("InfluenceRadius");
        this.neededAreaPercent = element.Int("NeededAreaPercent");
        this.worker = element.Int("WorkerUnit");
        this.maxWorkers = element.Int("MaxWorkerAmount");
        this.workerPause = element.Int("WorkerPause");
        this.wayTime = element.Int("WayTime");
        this.freeAreaType = element.String("FreeAreaType");
        this.cutTree = element.Boolean("CutTree");
      }
    }

    [Adapter]
    class FreeAreaBuilding : FactoryBuilding7 {
      [Nullable]
      public FreeAreaProductivity? freeAreaProductivity;

      public FreeAreaBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.freeAreaProductivity = values.Object<FreeAreaProductivity>("FreeAreaProductivity");
      }
    }
  }
}
