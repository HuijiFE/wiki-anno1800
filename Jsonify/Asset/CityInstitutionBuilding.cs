using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Anno1800.Jsonify {
  partial class Asset {
    class SpecialUnitThreshold : BaseAssetObject {
      [Element("UnitAmount")]
      public int unitAmount;
      [Element("HappinessThreshold")]
      public int happinessThreshold;
      [Element("PopulationCount")]
      public int populationCount;

      public SpecialUnitThreshold(XElement element) : base(element) { }
    }

    class IncidentResolver : BaseAssetObject {
      [Element("ResolverUnit")]
      public int ResolverUnit;
      [Element("SpecialUnit")]
      public int SpecialUnit;
      [Element("ResolvableIncident")]
      public string ResolvableIncident;
      public List<SpecialUnitThreshold> specialUnitThresholds;

      public IncidentResolver(XElement element) : base(element) {
        this.specialUnitThresholds = element.ListOf("SpecialUnitThresholds", item => new SpecialUnitThreshold(item));
      }
    }

    class Influence : BaseAssetObject {
      [Element("Distance")]
      public int distance;
      [Element("Influence")]
      public double influence;

      public Influence(XElement element) : base(element) { }
    }

    class IncidentInfluencer : BaseAssetObject {
      public Dictionary<string, Influence> influence;

      public IncidentInfluencer(XElement element) : base(element) {
        this.influence = element.Element("Influence")
          .Elements()
          .Where(item => item.Element("Influence") != null)
          .ToDictionary(item => item.Name.ToString(), item => new Influence(item));
      }
    }

    [Adapter]
    class CityInstitutionBuilding : Building {
      [Nullable]
      [Element("IncidentResolver")]
      public IncidentResolver? incidentResolver;
      [Nullable]
      [Element("IncidentInfluencer")]
      public IncidentInfluencer incidentInfluencer;

      public CityInstitutionBuilding(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }

    [Adapter]
    class IncidentResolverUnit : Asset {
      public IncidentResolverUnit(XElement asset, Dictionary<string, XElement> map) : base(asset, map) { }
    }
  }
}
