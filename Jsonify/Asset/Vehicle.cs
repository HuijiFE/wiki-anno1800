using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    //[Adapter]
    class Vehicle : Asset {
      [Nullable]
      [NonEmptyElement]
      [Element("Cost")]
      public CostData? cost;
      [Nullable]
      [NonEmptyElement]
      [Element("Attackable")]
      public AttackableData? attackable;
      [Nullable]
      [NonEmptyElement]
      [Element("Attacker")]
      public AttackerData attacker;
      [Nullable]
      [NonEmptyElement]
      [Element("ExpeditionAttribute")]
      public ExpeditionAttribute? expeditionAttribute;

      public Vehicle(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class EventTradeShip : Vehicle {
      public EventTradeShip(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class FeedbackVehicle : Vehicle {
      public FeedbackVehicle(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class FeedbackVehiclePatrol : Vehicle {
      public FeedbackVehiclePatrol(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class FeedbackVehicleWithTrailer : Vehicle {
      public FeedbackVehicleWithTrailer(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class FleetDummy : Vehicle {
      public FleetDummy(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class IceFloeDestroyer : Vehicle {
      public IceFloeDestroyer(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class LandSpy : Vehicle {
      public LandSpy(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class QuestVehicle : Vehicle {
      public QuestVehicle(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class QuestVehicleTrade : Vehicle {
      public QuestVehicleTrade(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class SimpleVehicle : Vehicle {
      public SimpleVehicle(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class TradeFeedbackVehicle : Vehicle {
      public TradeFeedbackVehicle(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class TradeShip : Vehicle {
      public TradeShip(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class WarShip : Vehicle {
      public WarShip(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
