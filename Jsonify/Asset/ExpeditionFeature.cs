using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class EventLimit : BaseAssetObject {
      [Element("MinAmount")]
      public int minAmount;
      [Element("MaxAmount")]
      public int maxAmount;
      [Element("MinAverageMoraleLoss")]
      public int minAverageMoraleLoss;
      [Element("MinThreats")]
      public int minThreats;
      [Element("MaxThreats")]
      public int maxThreats;
      [Element("MaxMorale")]
      public int maxMorale;

      public EventLimit(XElement element) : base(element) { }
    }

    class FeedOptionPair : BaseAssetObject {
      [Element("MoraleFactor")]
      public double moraleFactor;
      [Element("Product")]
      public int product;

      public FeedOptionPair(XElement element) : base(element) { }
    }

    class FeedOption : BaseAssetObject {
      public List<FeedOptionPair> options;
      [Element("FactorOnUse")]
      public double factorOnUse;
      [Element("RegainIfNotUsed")]
      public double regainIfNotUsed;

      public FeedOption(XElement element) : base(element) {
        this.options = element.Element("FeedOptions").Elements().Select(item => new FeedOptionPair(item)).ToList();
      }
    }

    class AttributeOptionPreparationLevel : BaseAssetObject {
      [Element("Threshold")]
      public int threshold;
      [Element("LevelName")]
      public int name;
      [Element("LevelDescription")]
      public int description;

      public AttributeOptionPreparationLevel(XElement element) : base(element) { }
    }

    class ExpeditionFeatureData : BaseAssetObject {
      public Dictionary<string, EventLimit> eventLimits;
      //[Element("AttributeImpactOnStartMorale")]
      //public bool attributeImpactOnStartMorale;
      [Element("FeedOption")]
      public FeedOption feadOption;
      public Dictionary<string, int> expeditionRegions;
      public Dictionary<string, int> attributeNames;
      public Dictionary<string, bool> traits;
      public List<AttributeOptionPreparationLevel> attributeOptionPreparationLevels;

      public ExpeditionFeatureData(XElement element) : base(element) {
        this.eventLimits = element
          .Element("EventLimits")
          .Elements()
          .ToDictionary(el => el.Name.ToString(), el => new EventLimit(el));
        this.expeditionRegions = element
          .Element("ExpeditionRegions")
          .Elements()
          .ToDictionary(el => el.Name.ToString(), el => el.Int("Region"));
        this.attributeNames = element
          .Element("AttributeNames")
          .Elements()
          .ToDictionary(el => el.Name.ToString(), el => el.Int("Name"));
        this.traits = element
          .Element("Traits")
          .Elements()
          .ToDictionary(el => el.Name.ToString(), el => el.Boolean("IsTrait"));
        this.attributeOptionPreparationLevels = element
          .Element("AttributeOptionPreparationLevel")
          .Elements()
          .Select(item => new AttributeOptionPreparationLevel(item))
          .ToList();

      }
    }

    [Adapter]
    class ExpeditionFeature : Asset {
      [Element("ExpeditionFeature")]
      public ExpeditionFeatureData expeditionFeature;

      public ExpeditionFeature(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
