using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class ItemConfigData : BaseAssetObject {
      public Dictionary<string, int> rarityText;
      public Dictionary<string, int> exclusiveGroupText;
      public Dictionary<string, int> allocationText;
      public Dictionary<string, string> allocationIcons;

      [Element("ItemGenCrateAsset")]
      public int itemGenCrateAsset;
      [Element("ItemGenCrateScale")]
      public double itemGenCrateScale;
      [Element("BuffFluffIndexIncreaseTimer")]
      public int buffFluffIndexIncreaseTimer;

      static Dictionary<string, int> GetTextDict(XElement element) {
        return element.Elements().ToDictionary(el => el.Name.ToString(), el => el.Int("Text"));
      }

      public ItemConfigData(XElement element) : base(element) {
        this.rarityText = GetTextDict(element.Element("RarityText"));
        this.exclusiveGroupText = GetTextDict(element.Element("ExclusiveGroupText"));
        this.allocationText = GetTextDict(element.Element("AllocationText"));
        this.allocationIcons = element
          .Element("AllocationIcons")
          .Elements()
          .ToDictionary<XElement, string, string>(el => el.String("Allocation") ?? "", el => el.String("AllocationIcon") ?? "");
      }
    }

    [Adapter]
    class ItemBalancing : Asset {
      [Nullable]
      [Element("ItemConfig")]
      public ItemConfigData? itemConfig;

      public ItemBalancing(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    class BuffData : BaseAssetObject {
      [Element("AddedInfolayer")]
      public int addedInfolayer;
      public List<int> possibleFluffTexts;

      public BuffData(XElement element) : base(element) {
        this.possibleFluffTexts = element.ListOf("PossibleFluffTexts", item => item.Int("FluffText"));
      }
    }

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

    class ItemEffect : BaseAssetObject {
      public List<int> targets;

      public ItemEffect(XElement element) : base(element) {
        this.targets = element.ListOf("EffectTargets", item => item.Int("GUID"));
      }
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

    class InputBenefitModifier : BaseAssetObject {
      [Element("Product")]
      public int product;
      [Element("AdditionalMoney")]
      public int additionalMoney;

      public InputBenefitModifier(XElement element) : base(element) { }
    }

    class OverrideIncidentAttractiveness : BaseAssetObject {
      [Element("Attractiveness")]
      public int attractiveness;
      [Element("OverrideEnabled")]
      public bool overrideEnabled;

      public OverrideIncidentAttractiveness(XElement element) : base(element) { }
    }

    class GoodConsumptionUpgrade : BaseAssetObject {
      [Element("ProvidedNeed")]
      public int providedNeed;
      [Element("AmountInPercent")]
      public int amountInPercent;

      public GoodConsumptionUpgrade(XElement element) : base(element) { }
    }

    class NeedProvideNeedUpgrade : BaseAssetObject {
      [Element("ProvidedNeed")]
      public int providedNeed;
      [Element("SubstituteNeed")]
      public int substituteNeed;

      public NeedProvideNeedUpgrade(XElement element) : base(element) { }
    }

    class ChangedSupplyValueUpgrade : BaseAssetObject {
      [Element("Need")]
      public int need;
      [Element("AmountInPercent")]
      public int amountInPercent;

      public ChangedSupplyValueUpgrade(XElement element) : base(element) { }
    }

    class AdditionalOutput : BaseAssetObject {
      [Element("Product")]
      public int product;
      [Element("AdditionalOutputCycle")]
      public int cycle;
      [Element("Amount")]
      public int amount;

      public AdditionalOutput(XElement element) : base(element) { }
    }

    class ReplaceInput : BaseAssetObject {
      [Element("OldInput")]
      public int oldInput;
      [Element("NewInput")]
      public int newInput;

      public ReplaceInput(XElement element) : base(element) { }
    }

    class InputAmountUpgrade : BaseAssetObject {
      [Element("Product")]
      public int product;
      [Element("Amount")]
      public int amount;

      public InputAmountUpgrade(XElement element) : base(element) { }
    }

    class AddStatusEffect : BaseAssetObject {
      [Element("StatusEffect")]
      public int effect;
      [Element("StatusDuration")]
      public int duration;

      public AddStatusEffect(XElement element) : base(element) { }
    }

    class ReplaceAssemblyOption : BaseAssetObject {
      [Element("OldOption")]
      public int oldOption;
      [Element("NewOption")]
      public int newOption;

      public ReplaceAssemblyOption(XElement element) : base(element) { }
    }

    class UpgradeData : BaseAssetObject {
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

      [Element("CultureUpgrade/ChangeModule")]
      public int changeModule;
      [Element("CultureUpgrade/ForcedFeedbackVariation")]
      public int forcedFeedbackVariation;
      [Element("CultureUpgrade/AdditionalModuleSoundLoop")]
      public int additionalModuleSoundLoop;
      [Element("BuildingUpgrade/ReplacingWorkforce")]
      public int replacingWorkforce;
      [Element("ResidenceUpgrade/AdditionalHappiness")]
      public int additionalHappiness;
      [Element("ResidenceUpgrade/TaxModifierInPercent")]
      public int taxModifierInPercent;
      [Element("ResidenceUpgrade/WorkforceModifierInPercent")]
      public int workforceModifierInPercent;
      [Element("FactoryUpgrade/AddedFertility")]
      public int addedFertility;
      [Element("FactoryUpgrade/NeedsElectricity")]
      public bool needsElectricity;
      [Element("ElectricUpgrade/ProvideElectricity")]
      public bool provideElectricity;
      [Element("AttackerUpgrade/AttackSpeedUpgrade")]
      public int attackSpeedUpgrade;
      [Element("AttackerUpgrade/UseProjectile")]
      public int useProjectile;
      [Element("PassiveTradeGoodGenUpgrade/GenProbability")]
      public int genProbability;
      [Element("PassiveTradeGoodGenUpgrade/GenPool")]
      public int genPool;
      [Element("ShipyardUpgrade/ConstructionCostInPercent")]
      public int ConstructionCostInPercent;
      [Element("ShipyardUpgrade/ConstructionTimeInPercent")]
      public int ConstructionTimeInPercent;
      [Element("VehicleUpgrade/ActivateWhiteFlag")]
      public bool activateWhiteFlag;
      [Element("VehicleUpgrade/ActivatePirateFlag")]
      public bool activatePirateFlag;
      [Element("KontorUpgrade/HappinessIgnoresMorale")]
      public bool happinessIgnoresMorale;
      [Element("KontorUpgrade/BlockHostileTakeover")]
      public bool blockHostileTakeover;
      [Element("KontorUpgrade/BlockBuyShare")]
      public bool blockBuyShare;
      [Element("TradeShipUpgrade/ActiveTradePriceInPercent")]
      public int activeTradePriceInPercent;

      public List<InputBenefitModifier> inputBenefitModifier;
      public List<GoodConsumptionUpgrade> goodConsumptionUpgrade;
      public List<NeedProvideNeedUpgrade> needProvideNeedUpgrade;
      public List<ChangedSupplyValueUpgrade> changedSupplyValueUpgrade;
      public Dictionary<string, OverrideIncidentAttractiveness> overrideIncidentAttractiveness;
      public List<AdditionalOutput> additionalOutput;
      public List<ReplaceInput> replaceInputs;
      public List<InputAmountUpgrade> inputAmountUpgrade;
      public List<AddStatusEffect> addStatusEffects;
      public Dictionary<string, double> damageFactor;
      public List<double> moraleDamage;
      public List<double> hitpointDamage;
      public List<int> addAssemblyOptions;
      public List<ReplaceAssemblyOption> replaceAssemblyOptions;
      public Dictionary<string, double> damageReceiveFactor;

      [Nullable]
      public Dictionary<string, UpgradePair>? upgrades;

      public UpgradeData(IEnumerable<XElement> elements) : base(elements) {
        this.inputBenefitModifier = elements.ListOf("PopulationUpgrade/InputBenefitModifier", item => new InputBenefitModifier(item));
        this.goodConsumptionUpgrade = elements.ListOf("ResidenceUpgrade/GoodConsumptionUpgrade", item => new GoodConsumptionUpgrade(item));
        this.needProvideNeedUpgrade = elements.ListOf("ResidenceUpgrade/NeedProvideNeedUpgrade", item => new NeedProvideNeedUpgrade(item));
        this.changedSupplyValueUpgrade = elements.ListOf("ResidenceUpgrade/ChangedSupplyValueUpgrade", item => new ChangedSupplyValueUpgrade(item));
        this.overrideIncidentAttractiveness = elements
          .DictionaryOf("IncidentInfectableUpgrade/OverrideIncidentAttractiveness", el => el.Name.ToString(), el => new OverrideIncidentAttractiveness(el));
        this.additionalOutput = elements.ListOf("FactoryUpgrade/AdditionalOutput", item => new AdditionalOutput(item));
        this.replaceInputs = elements.ListOf("FactoryUpgrade/ReplaceInputs", item => new ReplaceInput(item));
        this.inputAmountUpgrade = elements.ListOf("FactoryUpgrade/InputAmountUpgrade", item => new InputAmountUpgrade(item));
        this.addStatusEffects = elements.ListOf("AttackerUpgrade/AddStatusEffects", item => new AddStatusEffect(item));
        this.damageFactor = elements.DictionaryOf("AttackerUpgrade/DamageFactor", item => item.Name.ToString(), item => item.Double("Factor"));
        this.moraleDamage = elements.ListOf("AttackerUpgrade/MoraleDamage", item => item.Double("MinDamageFactor"));
        this.hitpointDamage = elements.ListOf("AttackerUpgrade/HitpointDamage", item => item.Double("MinDamageFactor"));
        this.addAssemblyOptions = elements.ListOf("ShipyardUpgrade/AddAssemblyOptions", item => item.Int("NewOption"));
        this.replaceAssemblyOptions = elements.ListOf("ShipyardUpgrade/ReplaceAssemblyOptions", item => new ReplaceAssemblyOption(item));
        this.damageReceiveFactor = elements.DictionaryOf("AttackableUpgrade/DamageReceiveFactor", item => item.Name.ToString(), item => item.Double("Factor"));

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
      [Element("ItemEffect")]
      public ItemEffect itemEffect;
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
      [Nullable]
      [Element("Buff")]
      public BuffData? buff;


      public Item(XElement asset, Dictionary<string, XElement> map) : base(asset, map) {
        var values = asset.Element("Values");

        this.upgrade = new UpgradeData(UpgradeData.upgradeWrappers.Select(name => values.Element(name)));
      }
    }

    [Adapter] class QuestItem : Item { public QuestItem(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ItemWithUI : Item { public ItemWithUI(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class ItemSpecialAction : Item { public ItemSpecialAction(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class QuestItemMagistrate : Item { public QuestItemMagistrate(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class FestivalBuff : Item { public FestivalBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class GuildhouseBuff : Item { public GuildhouseBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class TownhallBuff : Item { public TownhallBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class VehicleBuff : Item { public VehicleBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
    [Adapter] class HarbourOfficeBuff : Item { public HarbourOfficeBuff(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { } }
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
