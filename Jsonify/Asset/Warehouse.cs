using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class WarehouseData : BaseAssetObject {
      public string type;
      public int storage;

      public WarehouseData(XElement element) : base(element) {
        this.type = element.String("StorageType") ?? "";
        this.storage = element.Int("WarehouseStorage/StorageMax");
      }
    }

    [Adapter]
    class Warehouse : Building {
      [Nullable]
      public WarehouseData? warehouse;
      public int queues;
      public List<int> storedProducts;

      public Warehouse(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.warehouse = values.Object<WarehouseData>("Warehouse");
        this.queues = values.Int("LogisticNode/QueueConfiguration/ProcessingQueueParallelCount");
        this.storedProducts = values
          .ElementByPath("StorageBase/StoredProducts")
          ?.Elements()
          .Select(item => item.Int("Product"))
          .ToList()
          ?? new List<int>();
      }
    }
  }
}
