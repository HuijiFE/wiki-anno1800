using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ElectricData : BaseAssetObject {
      public bool boost;
      [Element("MandatoryElectricity")]
      public bool mandatory;

      public ElectricData(XElement element) : base(element) {
        this.boost = element.Boolean("BoostedByElectricity") || element.Boolean("ProductivityBoost");
      }
    }

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
      [Element("CycleTime", 30)]
      public int cycleTime;
      public List<FactoryInputOutputPair> inputs;
      public List<FactoryInputOutputPair> outputs;
      [Element("WarehouseTransporterAsset")]
      public int warehouseTransporterAsset;
      [Element("ProductivityTimeMultiplier")]
      public int productivityTimeMultiplier;
      [Element("ProductivityPoints")]
      public int productivityPoints;

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

    // FreeAreaProductivity ================

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
    class HeavyFactoryBuilding : FactoryBuilding7 {
      public HeavyFactoryBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class FreeAreaBuilding : FactoryBuilding7 {
      [Nullable]
      [Element("FreeAreaProductivity")]
      public FreeAreaProductivity? freeAreaProductivity;

      public FreeAreaBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class HeavyFreeAreaBuilding : FreeAreaBuilding {
      public HeavyFreeAreaBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // ModuleOwner ================

    class ModuleOwnerData : BaseAssetObject {
      public List<int> options;
      [Element("ModuleLimit")]
      public int limit;
      [Element("ModuleBuildRadius")]
      public int radius;

      public ModuleOwnerData(XElement element) : base(element) {
        this.options = element
          .Element("ConstructionOptions")
          ?.Elements()
          .Select(item => item.Int("ModuleGUID"))
          .ToList()
          ?? new List<int>();
      }
    }

    class ModuleOwnerBuilding : FactoryBuilding7 {
      [Nullable]
      [Element("ModuleOwner")]
      public ModuleOwnerData? moduleOwner;

      public ModuleOwnerBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class FarmBuilding : ModuleOwnerBuilding {
      public FarmBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class Farmfield : Building {
      public Farmfield(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class CultureBuilding : ModuleOwnerBuilding {
      public CultureBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class CultureModule : Building {
      public CultureModule(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // Slot ================

    class SlotData : BaseAssetObject {
      [Element("SlotType")]
      public string type;
      [Element("WorkArea")]
      public int workArea;
      [Element("SnapsToSlot")]
      public bool snapsToSlot;
      [Element("SlotCategoryName")]
      public int category;

      public SlotData(XElement element) : base(element) { }
    }

    [Adapter]
    class Slot : Building {
      [Nullable]
      [Element("Slot")]
      public SlotData? slot;

      public Slot(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class SlotFactoryBuilding7 : FactoryBuilding7 {
      [Nullable]
      [Element("Slot")]
      public SlotData? slot;

      public SlotFactoryBuilding7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class OilPumpBuilding : Slot {
      public OilPumpBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class PowerplantBuilding : FactoryBuilding7 {
      [Nullable]
      [Element("PublicService")]
      public PublicServiceData? publicService;

      public PowerplantBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    // Monument ================

    class MonumentData : BaseAssetObject {
      [Element("UpgradeTarget")]
      public int upgradeTarget;

      public MonumentData(XElement element) : base(element) { }
    }

    [Adapter]
    class Monument : FactoryBuilding7 {
      [Nullable]
      [Element("Monument")]
      public MonumentData? monument;

      public Monument(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
