using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ItemAction : BaseAssetObject {
      [Element("ActionTarget")]
      public int target;
      [Element("ActionDistance")]
      public int distance;
      [Element("ActionCooldown")]
      public int cooldown;
      [Element("ActionDescription")]
      public int description;
      [Element("StopMovementOnInteraction")]
      public bool stopMovementOnInteraction;
      [Element("ActionScope")]
      public string scope;
      [Element("RepairSpeed")]
      public int repairSpeed;
      //[Element("ItemAction")]
      //public string itemAction;
      [Element("ActionDuration")]
      public int duration;
      [Element("ActiveBuff")]
      public int buff;
      [Element("CanEndItemAction")]
      public bool canEnd;
      [Element("ActionIncidentType")]
      public List<string> incidentTypes;
      [Element("IsDestroyedAfterCooldown")]
      public bool isDestroyedAfterCooldown;
      [Element("RadiusBuffTargets")]
      public List<string> radiusBuffTargets;

      public ItemAction(XElement element) : base(element) { }
    }

    //ActiveItem
    //CultureBuff
    //CultureItem
    //FestivalBuff
    //FluffItem
    //GuildhouseBuff
    //GuildhouseItem
    //HarbourOfficeBuff
    //HarborOfficeItem
    //InfluenceTitleBuff
    //ItemConstructionPlan
    //ItemSpecialAction
    //ItemSpecialActionVisualEffect
    //QuestItem
    //QuestItemMagistrate
    //ShipSpecialist
    //StartExpeditionItem
    //TownhallBuff
    //TownhallItem
    //VehicleBuff
    //VehicleItem
    class Item : Asset {
      [Nullable]
      [Element("ItemAction")]
      public ItemAction? itemAction;
      [Nullable]
      [Element("ExpeditionAttribute")]
      public ExpeditionAttribute? expeditionAttribute;

      public Item(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class ActiveItem : Item {
      public ActiveItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
