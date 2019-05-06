using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class WarehouseData : BaseAssetObject {
      [Element("StorageType")]
      public string type;
      [Element("WarehouseStorage/StorageMax")]
      public int storage;

      public WarehouseData(XElement element) : base(element) { }
    }

    [Adapter]
    class Warehouse : Building {
      [Nullable]
      [Element("Warehouse")]
      public WarehouseData? warehouse;
      [Element("LogisticNode/QueueConfiguration/ProcessingQueueParallelCount")]
      public int queues;
      public List<int> storedProducts;

      public Warehouse(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.storedProducts = values
          .ElementByPath("StorageBase/StoredProducts")
          ?.Elements()
          .Select(item => item.Int("Product"))
          .ToList()
          ?? new List<int>();
      }
    }

    [Adapter]
    class HarborWarehouse7 : Warehouse {
      public HarborWarehouse7(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class HarborWarehouseStrategic : Warehouse {
      public HarborWarehouseStrategic(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class HarborDepot : Warehouse {
      public HarborDepot(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
