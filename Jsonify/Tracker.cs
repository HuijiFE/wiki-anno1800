using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace Anno1800.Jsonify {
  class Tracker {
    public static void Track(
      Dictionary<string, XElement> assetsMap,
      Dictionary<string, List<Asset>> dataDict,
      Dictionary<string, string> localization,
      string output
      ) {

      var flatProps = new HashSet<string> {
        "Building",
        "Upgradable",
        "Culture",
        "Fertility",
        "Slot",
        "Factory7",
        "FactoryBase",
        "FreeAreaProductivity",
        "ModuleOwner",
        "Electric",
        "Monument",
        "PublicService",
        "Market",
        "StorageBase",
        "Warehouse",
        "Ornament",
        "RepairCrane",
        "Shipyard",
        "IncidentResolver",
        "IncidentInfluencer",
        "IncidentInfectable",

        "Item",
        "Buff",
      };

      var paths = new List<string> {
        "Attackable",
        "Attacker",
        "Attacker/AccuracyByDistance/Item",
        "Attacker/AccuracyByDistance/Item/AccuracyByDistancePair",
        "Projectile",
        "ProjectileIncident",
        "Exploder",
        "Cost",
        "Cost/Costs/Item",
        "Maintenance",
        "Maintenance/Maintenances/Item",
        "Building",
        "Upgradable",
        "Upgradable/UpgradeCost/Item",
        "Culture",
        "Culture/SetPages/Item",
        "Culture/SetPages/Item/Page/Item",
        "Electric",
        "Pausable",
        "Constructable",
        "Bridge",
        "Street",
        "Residence7",
        "Residence7/ResidenceStorage",
        "PopulationGroup7",
        "PopulationLevel7",
        "PopulationLevel7/PopulationInputs/Item",
        "PopulationLevel7/PopulationOutputs/Item",
        "ResourceSetCondition",
        "Fertility",
        "FertilitySet",
        "MineSlotResourceSet",
        "Fertility",
        "Slot",
        "Factory7",
        "FactoryBase",
        "FreeAreaProductivity",
        "ModuleOwner",
        "Monument",
        "PublicService",
        "Market",
        "StorageBase",
        "StorageBase/StoredProducts/Item",
        "Warehouse",
        "Warehouse/WarehouseStorage",
        "LogisticNode",
        "LogisticNode/QueueConfiguration",
        "Ornament",
        "RepairCrane",
        "Shipyard",
        "IncidentResolver",
        "IncidentInfluencer",
        "IncidentInfectable",
        "IncidentInfectable/Explosion",
        "IncidentInfectable/Infectable/Item",
        "IncidentInfectable/IncidentInfectionChanceFactors/Item",
        "IncidentInfectable/PerIncidentProximityEffect/Item",

        // Vehicle
        "Walking",
        "CommandQueue",
        "Drifting",
        "Draggable",
        "Craftable",
        "ShipMaintenance",
        "Sellable",

        // Item
        "Item",
        "ItemAction",
        "ItemWithUI",
        "SpecialAction",
        "ItemEffect",
        "ExpeditionAttribute",
        "IncidentInfluencerUpgrade",
        "CultureUpgrade",
        "BuildingUpgrade",
        "PopulationUpgrade",
        "ResidenceUpgrade",
        "VisitorHarborUpgrade",
        "IncidentInfectableUpgrade",
        "Buff",
        "FactoryUpgrade",
        "ModuleOwnerUpgrade",
        "ElectricUpgrade",
        "ItemGeneratorUpgrade",
        "AttackerUpgrade",
        "PassiveTradeGoodGenUpgrade",
        "ShipyardUpgrade",
        "AttackableUpgrade",
        "ProjectileUpgrade",
        "VehicleUpgrade",
        "RepairCraneUpgrade",
        "KontorUpgrade",
        "TradeShipUpgrade",
        "ItemStartExpedition",
        "ItemConstructionPlan",
        "NewspaperUpgrade",
        "DistributionUpgrade",
      };

      var vehicleTemplates = new List<string> {
        "EventTradeShip",
        "FeedbackVehicle",
        "FeedbackVehiclePatrol",
        "FeedbackVehicleWithTrailer",
        "FleetDummy",
        "IceFloeDestroyer",
        "LandSpy",
        "QuestVehicle",
        "QuestVehicleTrade",
        "SimpleVehicle",
        "TradeFeedbackVehicle",
        "TradeShip",
        "WarShip",
      };

      var props = new HashSet<string>(assetsMap
        .Values
        .Select(a => a.Element("Values").Elements())
        .Aggregate((agg, cur) => agg.Concat(cur))
        .Select(p => p.Name.ToString()));

      var subProps = new HashSet<string>(paths).ToDictionary(
        path => path,
        path => {
          var isItem = path.EndsWith("/Item");
          path = isItem ? path.Replace("/Item", "") : path;
          var elements = assetsMap
            .Select(kvp => kvp.Value.Element("Values").ElementByPath(path))
            .Where(el => el != null);
          if (isItem && elements.Count() > 0) {
            elements = elements.Select(el => el.Elements()).Aggregate((agg, cur) => agg.Concat(cur));
          }
          return elements.Count() > 0
            ? elements
              .Select(el => el.Elements().Where(el => el.Name != "VectorElement").Select(el => el.Name.ToString()))
              .Aggregate((agg, cur) => agg.Concat(cur))
              .ToHashSet()
              .ToList()
            : new List<string>();
        });

      var templates = flatProps
        .ToDictionary(
          flag => flag,
          flag => new HashSet<string>(assetsMap
              .Values
              .Where(a => a.ElementByPath($"Values/{flag}") != null)
              .Select(a => a.String("Template"))));

      var items = assetsMap
        .Values
        .Where(a => a.ElementByPath("Values/Item") != null || a.ElementByPath("Values/ItemEffect") != null || a.ElementByPath("Values/Buff") != null)
        .ToList();
      var itemProps = items
        .Aggregate(new List<XElement>(), (list, item) => {
          list.AddRange(item.Element("Values").Elements());
          return list;
        });
      var upgrades = itemProps
        .Aggregate(new List<XElement>(), (list, prop) => {
          list.AddRange(prop.Elements());
          return list;
        })
        .Where(upg => upg.HasElements && !upg.Elements().Any(p => p.Name != "Value" && p.Name != "Percental"))
        .ToList();

      var vehicleProps = new HashSet<string>(assetsMap
        .Values
        .Where(a => vehicleTemplates.Contains(a.String("Template")))
        .Select(a => a.Element("Values").Elements())
        .Aggregate(new List<XElement>(), (list, props) => {
          list.AddRange(props);
          return list;
        })
        .Select(p => p.Name.ToString()));

      var assetsReport = new SortedDictionary<string, List<string>>(dataDict
        .ToDictionary(
          kvp => kvp.Key,
          kvp => kvp
            .Value
            .Select(data => localization.ContainsKey(data.guid.ToString()) ? localization[data.guid.ToString()] : data.guid.ToString())
            .ToList()
          ));

      var report = new Dictionary<string, object> {
        { "xmlProps", props },
        { "xmlTmpl", templates },
        { "xmlSubProps", subProps },
        { "xmlItem", new {
          items = new HashSet<string>(items.Select(item => item.String("Template"))),
          itemProps = new HashSet<string>(itemProps.Select(p => p.Name.ToString())),
          upgrades = new HashSet<string>(upgrades.Select(p => p.Name.ToString())),
        }},
        { "xmlVehicle", vehicleProps },
        { "assets", assetsReport }
      };

      var dest = Path.Combine(output, "report.json");
      IO.Save(JsonConvert.SerializeObject(report, Formatting.Indented), dest);
      Console.WriteLine($"Report: {dest}");
    }
  }
}
