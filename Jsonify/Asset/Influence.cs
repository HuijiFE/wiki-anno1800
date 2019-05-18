using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

    class InfluenceConfig : BaseAssetObject {
      [Element("FreeAmount")]
      public int freeAmount;
      [Element("InfluenceCosts")]
      public double costs;
      [Element("SubCategoryName")]
      public int subCategoryName;

      public InfluenceConfig(XElement element) : base(element) { }
    }

    class InfluencCategoryBuff : BaseAssetObject {
      [Element("Buff")]
      public int buff;
      [Element("MinSpentInfluence")]
      public int minSpentInfluence;
      [Element("MaxSpentInfluence")]
      public int maxSpentInfluence;

      public InfluencCategoryBuff(XElement element) : base(element) { }
    }

    class InfluenceCategory : BaseAssetObject {
      [Element("CategoryName")]
      public int name;
      public List<string> usageTypes;
      public List<InfluencCategoryBuff> buffs;
      [Element("BaseSharePrice")]
      public int baseSharePrice;

      public InfluenceCategory(XElement element) : base(element) {
        this.usageTypes = element.ListOf("UsageTypes", item => item.String("Type"));
        this.buffs = element.ListOf("CategoryBuffs", item => new InfluencCategoryBuff(item));
      }
    }

    class InfluenceFeatureData : BaseAssetObject {
      public Dictionary<string, InfluenceConfig> configs;
      public Dictionary<string, InfluenceCategory> categories;

      public InfluenceFeatureData(XElement element) : base(element) {
        this.configs = element.DictionaryOf("InfluenceConfig", item => item.Name.ToString(), item => new InfluenceConfig(item));
        this.categories = element.DictionaryOf("InfluenceCategories", item => item.Name.ToString(), item => new InfluenceCategory(item));
      }
    }

    [Adapter]
    class InfluenceFeature : Asset {
      [Element("InfluenceFeature")]
      public InfluenceFeatureData influenceFeature;

      public InfluenceFeature(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    class InfluencePopupData : BaseAssetObject {
      [Element("InfluencePopupTitle")]
      public int influencePopupTitle;
      [Element("InfluencePopupCommentTitle")]
      public int influencePopupCommentTitle;
      [Element("InfluencePopupCommentText")]
      public int influencePopupCommentText;
      [Element("PropagandaDescription")]
      public int propagandaDescription;

      public InfluencePopupData(XElement element) : base(element) { }
    }

    [Adapter]
    class InfluencePopup : Asset {
      [Element("InfluencePopup")]
      public InfluencePopupData influencePopup;

      public InfluencePopup(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    class CompanyLevelData : BaseAssetObject {
      [Element("PopulationCountOffset")]
      public double populationCountOffset;
      [Element("PopulationFactor")]
      public double populationFactor;
      [Element("Exponent")]
      public double exponent;
      [Element("SecondLevel")]
      public int secondLevel;
      [Element("SecondPopulationFactor")]
      public double secondPopulationFactor;
      [Element("SecondExponent")]
      public double secondExponent;

      public int Population(int level) {
        double population = this.populationCountOffset + Math.Pow(level, this.exponent) * this.populationFactor;
        if (level > this.secondLevel) {
          double secondPopulation =
            this.populationCountOffset + Math.Pow(this.secondLevel, this.exponent) * this.populationFactor
            + Math.Pow(level - this.secondLevel, this.secondExponent) * this.secondPopulationFactor;
          population = Math.Round(Math.Max(population, secondPopulation) / 10.0) * 10.0;
        }
        return (int)population;
      }

      public CompanyLevelData(XElement element) : base(element) {
        for (int level = 1; level < 100; level++) {
          Console.WriteLine($"{level.ToString().PadRight(3, ' ')}: {this.Population(level)}");
        }
      }
    }

    class ParticipantRepresentationFeatureData : BaseAssetObject {
      [Element("CompanyLevel")]
      public CompanyLevelData companyLevel;
      public List<string> colors;

      public ParticipantRepresentationFeatureData(XElement element) : base(element) {
        this.colors = element
          .Element("ParticipantColors")
          ?.Elements()
          .Select(color => color.Color("ParticipantColor"))
          .ToList()
          ?? new List<string>();
      }
    }

    [Adapter]
    class ParticipantRepresentationFeature : Asset {
      [Element("ParticipantRepresentationFeature")]
      public ParticipantRepresentationFeatureData participant;

      public ParticipantRepresentationFeature(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
