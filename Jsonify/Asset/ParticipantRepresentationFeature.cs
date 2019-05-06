using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {

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
        //for (int level = 1; level <= 64; level++) {
        //  Console.WriteLine($"{level.ToString().PadRight(3, ' ')}: {this.Population(level)}");
        //}
      }
    }

    class ParticipantRepresentationFeatureData : BaseAssetObject {
      [Nullable]
      [Element("CompanyLevel")]
      public CompanyLevelData? companyLevel;
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
      [Nullable]
      [Element("ParticipantRepresentationFeature")]
      public ParticipantRepresentationFeatureData? participant;

      public ParticipantRepresentationFeature(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
