using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class FactoryInputOutputPair : BaseAssetObject {
      [Element("Product")]
      public int product;
      [Element("Amount")]
      public int amount;
      [Element("StorageAmount")]
      public int storage;

      public FactoryInputOutputPair(XElement element) : base(element) { }
    }

    class FactoryData : BaseAssetObject {
      public List<FactoryInputOutputPair> inputs;
      public List<FactoryInputOutputPair> outputs;
      [Element("CycleTime", 30)]
      public int cycleTime;

      public int neededFertility;

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
      }
    }

    [Adapter]
    class FactoryBuilding7 : Building {
      [Nullable]
      [Element("Maintenance")]
      public MaintenanceData? maintenance;
      [Nullable]
      [Element("FactoryBase")]
      public FactoryData? factory;
      [Nullable]
      [Element("Culture")]
      public CultureData? culture;
      [Nullable]
      [Element("Electric")]
      public ElectricData? electric;

      public FactoryBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");
        this.factory.neededFertility = values.Int("Factory7/NeededFertility");
      }
    }
  }
}
