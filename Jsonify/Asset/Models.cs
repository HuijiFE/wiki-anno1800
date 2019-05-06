using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    // ================================
    // Attackable

    class AttackableData : BaseAssetObject {
      [Element("MaximumHitPoints")]
      public int maximumHitPoints;
      [Element("HasRuinState")]
      public bool hasRuinState;
      [Element("SelfHealPerHealTick")]
      public double selfHealPerHealTick;
      [Element("PausedTimeIfAttacked")]
      public bool pausedTimeIfAttacked;
      [Element("CanBeAttackedByPlayer")]
      public bool canBeAttackedByPlayer;
      [Element("MoralePower")]
      public int moralePower;
      [Element("IsInvulnerable")]
      public bool isInvulnerable;
      [Element("MilitaryDefensePoints")]
      public double militaryDefensePoints;
      [Element("AccuracyWidth")]
      public double accuracyWidth;
      [Element("SelfHealPausedTimeIfAttacked")]
      public int selfHealPausedTimeIfAttacked;
      [Element("ArmorType")]
      public string armorType;
      [Element("DisableGettingAutoAttacked")]
      public bool disableGettingAutoAttacked;

      public AttackableData(XElement element) : base(element) { }
    }

    // ================================
    // Attacker
    class AttackerData : BaseAssetObject {
      [Element("AttackType")]
      public string type;
      [Element("AttackRange")]
      public int range;
      [Element("AttackRangeApproachPercentage")]
      public double attackRangeApproachPercentage;
      [Element("LineOfSightRange")]
      public int lineOfSightRange;
      [Element("ReloadTime")]
      public int reloadTime;
      [Element("ProjectileAsset")]
      public int projectile;
      [Element("BaseDamage")]
      public int baseDamage;
      [Element("AccuracyBase")]
      public double accuracyBase;
      [Element("AccuracyIncreaseOverDistance")]
      public int accuracyIncreaseOverDistance;
      [Element("AccuracySpeedDecay")]
      public int accuracySpeedDecay;
      [Element("EmitProjectileTimeAfterStartAnimation")]
      public double emitProjectileTimeAfterStartAnimation;
      [Element("TargetAngleVariation")]
      public int targetAngleVariation;
      [Element("ShootingTracking")]
      public string shootingTracking;
      [Element("ProjectileCount")]
      public int projectileCount;
      //[Element("FullVolleyTimeMin")]
      //public double fullVolleyTimeMin;
      //[Element("FullVolleyTimeMax")]
      //public double fullVolleyTimeMax;
      //[Element("VolleyMaxPerBulletRandomOffset")]
      //public double volleyMaxPerBulletRandomOffset;

      public List<int> turrets;

      public AttackerData(XElement element) : base(element) {
        this.turrets = element
          .Element("Turrets")
          ?.Elements()
          .Select(item => item.Int("TurnSpan"))
          .ToList()
          ?? new List<int>();
      }
    }

    // ================================
    // Cost

    class CostPair : BaseAssetObject {
      [Element("Ingredient")]
      public int ingredient;
      [Element("Amount")]
      public int amount;

      public CostPair(XElement element) : base(element) { }
    }

    class CostData : BaseAssetObject {
      public List<CostPair> costs;

      public CostData(XElement element) : base(element) {
        this.costs = element
          .Element("Costs")
          ?.Elements()
          .Select(item => new CostPair(item))
          .ToList()
          ?? new List<CostPair>();
      }
    }

    // ================================
    // Maintenance

    class MaintenancePair : BaseAssetObject {
      [Element("Product")]
      public int product;
      [Element("Amount")]
      public int amount;
      [Element("InactiveAmount")]
      public int inactiveAmount;
      [Element("ShutdownThreshold")]
      public double shutdownThreshold;

      public MaintenancePair(XElement element) : base(element) { }
    }

    class MaintenanceData : BaseAssetObject {
      public List<MaintenancePair> maintenances;
      [Element("ConsumerPriority")]
      public int consumerPriority;

      public MaintenanceData(XElement element) : base(element) {
        this.maintenances = element
          .Element("Maintenances")
          ?.Elements()
          .Select(item => new MaintenancePair(item))
          .ToList()
          ?? new List<MaintenancePair>();
      }
    }
  }
}
