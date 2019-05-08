using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class ProjectileEffectivitie : BaseAssetObject {
      [Element("GUID")]
      public int guid;
      [Element("Factor")]
      public int factor;

      public ProjectileEffectivitie(XElement element) : base(element) { }
    }

    class StatusEffect : BaseAssetObject {
      [Element("StatusEffect")]
      public int effect;
      [Element("StatusDuration")]
      public int duration;

      public StatusEffect(XElement element) : base(element) { }
    }

    class ProjectileData : BaseAssetObject {
      [Element("ProjectileType")]
      public string type;
      [Element("ShotHeight")]
      public double shotHeight;
      [Element("ProjectileSpeed")]
      public double speed;
      [Element("ShotAngle")]
      public int ShotAngle;
      [Element("TargetWhiteList")]
      public List<string> targetWhiteList;

      public List<ProjectileEffectivitie> effectivities;
      public List<StatusEffect> statusEffects;

      public ProjectileData(XElement element) : base(element) {
        this.effectivities = element.ListOf("Effectivities", item => new ProjectileEffectivitie(item));
        this.statusEffects = element.ListOf("StatusEffects", item => new StatusEffect(item));
      }
    }

    class ProjectileIncident : BaseAssetObject {
      [Element("CausedIncident")]
      public string causedIncident;
      [Element("CausedIncidentBuff")]
      public int causedIncidentBuff;
      [Element("CausedIncidentDuration")]
      public int causedIncidentDuration;

      public ProjectileIncident(XElement element) : base(element) { }
    }

    [Adapter]
    class Projectile : Asset {
      [Nullable]
      [NonEmptyElement]
      [Element("Projectile")]
      public ProjectileData? projectile;
      [Nullable]
      [NonEmptyElement]
      [Element("ProjectileIncident")]
      public ProjectileIncident? projectileIncident;

      public Projectile(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    class ExploderData : BaseAssetObject {
      [Element("InnerDamageRadius")]
      public double innerDamageRadius;
      [Element("OuterDamageRadius")]
      public double outerDamageRadius;
      [Element("MinimumDamage")]
      public double minimumDamage;
      [Element("InnerDamage")]
      public double innerDamage;
      [Element("DebrisForceY")]
      public int debrisForceY;
      [Element("DebrisCount")]
      public int debrisCount;
      [Element("FriendlyFireFactor")]
      public int FriendlyFireFactor;

      public ExploderData(XElement element) : base(element) { }
    }

    [Adapter]
    class ExplodingProjectile : Projectile {
      [Nullable]
      [NonEmptyElement]
      [Element("Exploder")]
      public ExploderData? exploder;

      public ExplodingProjectile(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
