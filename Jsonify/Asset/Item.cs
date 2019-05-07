using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ItemData : BaseAssetObject {
      [Element("Flotsam")]
      public int flotsam;
      [Element("Allocation")]
      public string allocation;
      [Element("MaxStackSize")]
      public int maxStackSize;
      [Element("Rarity")]
      public string rarity;
      [Element("HasAction")]
      public bool hasAction;
      [Element("TradePrice")]
      public bool tradePrice;
      [Element("TransferBlocked")]
      public bool transferBlocked;
      [Element("ItemType")]
      public bool itemType;
      [Element("ItemSet")]
      public int itemSet;
      [Element("ExclusiveGroup")]
      public string exclusiveGroup;
      [Element("IsDestroyedOnUnequip")]
      public bool isDestroyedOnUnequip;

      public ItemData(XElement element) : base(element) { }
    }

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

    class SpecialAction : BaseAssetObject {
      [Element("Projectile")]
      public int projectile;
      [Element("BarrageCount")]
      public int barrageCount;
      [Element("BarrageDuration")]
      public int barrageDuration;
      [Element("ActionRadius")]
      public int actionRadius;
      [Element("Delay")]
      public int delay;

      public SpecialAction(XElement element) : base(element) { }
    }

    class UpgradePair : BaseAssetObject {
      [Element("Value")]
      public int value;
      [Element("Percental")]
      public bool percental;

      public UpgradePair(XElement element) : base(element) { }
    }

    class OverrideIncidentAttractivenessPair : BaseAssetObject {
      [Element("Attractiveness")]
      public int attractiveness;
      [Element("OverrideEnabled")]
      public bool overrideEnabled;

      public OverrideIncidentAttractivenessPair(XElement element) : base(element) { }
    }

    class UpgradeData : BaseAssetObject {
      [Nullable]
      public Dictionary<string, UpgradePair>? upgrades;
      public int replacingWorkforce;
      [Nullable]
      public Dictionary<string, OverrideIncidentAttractivenessPair>? OverrideIncidentAttractiveness;

      public static readonly List<string> upgradeWrappers = new List<string> {
        "IncidentInfluencerUpgrade",
        "PopulationUpgrade",
        "ResidenceUpgrade",
        "CultureUpgrade",
        "KontorUpgrade",
        "AttackableUpgrade",
        "AttackerUpgrade",
        "BuildingUpgrade",
        "FactoryUpgrade",
        "PassiveTradeGoodGenUpgrade",
        "ShipyardUpgrade",
        "VisitorHarborUpgrade",
        "VisitorUpgrade",
        "ModuleOwnerUpgrade",
        "IncidentInfectableUpgrade",
        "VehicleUpgrade",
        "ProjectileUpgrade",
        "TradeShipUpgrade",
        "ElectricUpgrade",
        "ItemGeneratorUpgrade",
        "RepairCraneUpgrade",
      };

      public static readonly List<string> upgradeElementNames = new List<string> {
        "RiotInfluenceUpgrade",
        "WorkforceAmountUpgrade",
        "ProductivityUpgrade",
        "MaintenanceUpgrade",
        "AttractivenessUpgrade",
        "SpawnProbabilityFactor",
        "IncidentExplosionIncreaseUpgrade",
        "IncidentIllnessIncreaseUpgrade",
        "ResidentsUpgrade",
        "IncidentFireIncreaseUpgrade",
        "IncidentRiotIncreaseUpgrade",
        "ForwardSpeedUpgrade",
        "ReloadTimeUpgrade",
        "MaxHitpointsUpgrade",
        "MaintainanceUpgrade",
        "IgnoreWeightFactorUpgrade",
        "AttackRangeUpgrade",
        "BaseDamageUpgrade",
        "LineOfSightRangeUpgrade",
        "AccuracyUpgrade",
        "SelfHealUpgrade",
        "SelfHealPausedTimeIfAttackedUpgrade",
        "MoralePowerUpgrade",
        "IgnoreDamageFactorUpgrade",
        "OutputAmountFactorUpgrade",
        "ResolverUnitDecreaseUpgrade",
        "ResolverUnitMovementSpeedUpgrade",
        "ResolverUnitCountUpgrade",
        "SpecialUnitHappinessThresholdUpgrade",
        "PublicServiceFullSatisfactionDistance",
        "PublicServiceNoSatisfactionDistance",
        "ModuleLimitUpgrade",
        "StressUpgrade",
        "NeededAreaPercentUpgrade",
        "LoadingSpeedUpgrade",
        "HealRadiusUpgrade",
        "HealPerMinuteUpgrade",
        "FireInfluenceUpgrade",
        "IllnessInfluenceUpgrade",
        "DistanceUpgrade",
        "HealBuildingsPerMinuteUpgrade"
      };

      public UpgradeData(List<XElement> elements) : base(null) {
        var dict = elements
          .Where(el => el != null && el.HasElements)
          .Select(el => el.Elements())
          .Aggregate(new List<XElement>(), (agg, cur) => {
            agg.AddRange(cur);
            return agg;
          })
          .Where(el => upgradeElementNames.Contains(el.Name.ToString()))
          .ToDictionary(el => el.Name.ToString(), el => new UpgradePair(el));
        if (dict.Count > 0) {
          this.upgrades = dict;
        }
      }
    }

    // Item
    class Item : Asset {
      [Nullable]
      [Element("Item")]
      public ItemData item;
      [Nullable]
      [Element("ExpeditionAttribute")]
      public ExpeditionAttribute? expeditionAttribute;
      [Nullable]
      [Element("ItemAction")]
      public ItemAction? itemAction;
      [Nullable]
      [NonEmptyElement]
      [Element("SpecialAction")]
      public SpecialAction? specialAction;
      [Nullable]
      public UpgradeData upgrade;


      public Item(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.upgrade = new UpgradeData(UpgradeData
          .upgradeWrappers
          .Select(name => values.Element(name))
          .ToList()
          );
        this.upgrade.replacingWorkforce = values.Int("BuildingUpgrade/ReplacingWorkforce");
        this.upgrade.OverrideIncidentAttractiveness = values
          .ElementByPath("IncidentInfectableUpgrade/OverrideIncidentAttractiveness")
          ?.Elements()
          .ToDictionary(el => el.Name.ToString(), el => new OverrideIncidentAttractivenessPair(el));
      }
    }

    [Adapter] class QuestItem : Item { public QuestItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ItemWithUI : Item { public ItemWithUI(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ItemSpecialAction : Item { public ItemSpecialAction(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class QuestItemMagistrate : Item { public QuestItemMagistrate(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    //[Adapter] class FestivalBuff : Item { public FestivalBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    //[Adapter] class GuildhouseBuff : Item { public GuildhouseBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    //[Adapter] class TownhallBuff : Item { public TownhallBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    //[Adapter] class VehicleBuff : Item { public VehicleBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    //[Adapter] class HarbourOfficeBuff : Item { public HarbourOfficeBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class CultureItem : Item { public CultureItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class TownhallItem : Item { public TownhallItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class GuildhouseItem : Item { public GuildhouseItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class HarborOfficeItem : Item { public HarborOfficeItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ShipSpecialist : Item { public ShipSpecialist(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class VehicleItem : Item { public VehicleItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ActiveItem : Item { public ActiveItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ItemSpecialActionVisualEffect : Item { public ItemSpecialActionVisualEffect(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class FluffItem : Item { public FluffItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class StartExpeditionItem : Item { public StartExpeditionItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ItemConstructionPlan : Item { public ItemConstructionPlan(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }

  }
}
