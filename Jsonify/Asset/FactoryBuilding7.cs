using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class FactoryInputOutputPair : BaseAssetObject {
      public int product;
      public int amount;
      public int storage;

      public FactoryInputOutputPair(XElement element) : base(element) {
        this.product = element.Int("Product");
        this.amount = element.Int("Amount");
        this.storage = element.Int("StorageAmount");
      }
    }

    class FactoryData : BaseAssetObject {
      public List<FactoryInputOutputPair> inputs;
      public List<FactoryInputOutputPair> outputs;
      public int cycleTime;

      public FactoryData(XElement element) : base(element) {
        this.inputs = element
          .Element("FactoryInputs")
          ?.Elements()
          .Select(item => new FactoryInputOutputPair(item))
          .ToList()
          ?? new List<FactoryInputOutputPair>();
        this.outputs = element
          .Element("FactoryOutputs")
          ?.Elements()
          .Select(item => new FactoryInputOutputPair(item))
          .ToList()
          ?? new List<FactoryInputOutputPair>();
        this.cycleTime = element.Int("CycleTime", 30);
      }
    }

    [Adapter]
    class FactoryBuilding7 : Building {
      public MaintenanceData? maintenance;
      public int neededFertility;
      public FactoryData? factory;
      public CultureData? culture;
      public ElectricData? electic;

      public FactoryBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.maintenance = values.Object<MaintenanceData>("Maintenance");
        this.neededFertility = values.Int("Factory7/NeededFertility");
        this.factory = values.Object<FactoryData>("FactoryBase");
        this.culture = values.Object<CultureData>("Culture");
        this.electic = values.Object<ElectricData>("Electric");
      }
    }
  }
}
