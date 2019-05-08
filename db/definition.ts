/* eslint-disable */

export interface Asset {
  guid: number;
  name: string;
  id: string;
  icon: string;
  description?: number;
}

export interface Anno extends Asset {
}

export interface Building extends Asset {
  attackable?: AttackableData;
  building?: BuildingData;
  cost?: CostData;
}

export interface CityInstitutionBuilding extends Building {
  incidentResolver?: IncidentResolver;
  incidentInfluencer?: IncidentInfluencer;
}

export interface IncidentResolverUnit extends Asset {
}

export interface ColorConfig extends Building {
  colorConfig?: ColorConfigData;
}

export interface ExpeditionFeature extends Asset {
  expeditionFeature: ExpeditionFeatureData;
}

export interface FactoryBuilding7 extends Building {
  maintenance?: MaintenanceData;
  factory?: FactoryData;
  culture?: CultureData;
  electric?: ElectricData;
}

export interface HeavyFactoryBuilding extends FactoryBuilding7 {
  incidentInfluencer?: IncidentInfluencer;
}

export interface FreeAreaBuilding extends FactoryBuilding7 {
  freeAreaProductivity?: FreeAreaProductivity;
}

export interface HeavyFreeAreaBuilding extends FreeAreaBuilding {
  incidentInfluencer?: IncidentInfluencer;
}

export interface ModuleOwnerBuilding extends FactoryBuilding7 {
  moduleOwner?: ModuleOwnerData;
}

export interface FarmBuilding extends ModuleOwnerBuilding {
}

export interface Farmfield extends Building {
}

export interface CultureBuilding extends ModuleOwnerBuilding {
}

export interface CultureModule extends Building {
}

export interface Slot extends Building {
  slot?: SlotData;
}

export interface SlotFactoryBuilding7 extends FactoryBuilding7 {
  slot?: SlotData;
}

export interface OilPumpBuilding extends Slot {
}

export interface PowerplantBuilding extends FactoryBuilding7 {
  publicService?: PublicServiceData;
}

export interface Monument extends FactoryBuilding7 {
  monument?: MonumentData;
}

export interface ItemFilter extends Asset {
  itemFilter?: ItemFilterData;
}

export interface ProductFilter extends Asset {
  productFilter?: ProductFilterData;
}

export interface Guildhouse extends Building {
  incidentInfluencer?: IncidentInfluencer;
}

export interface HarborOffice extends Building {
}

export interface HarborBuilding extends Building {
  maintenance?: MaintenanceData;
  culture?: CultureData;
}

export interface HarborBuildingAttacker extends HarborBuilding {
  attacker?: AttackerData;
}

export interface VisitorPier extends Building {
  maintenance?: MaintenanceData;
}

export interface WorkforceConnector extends Building {
  maintenance?: MaintenanceData;
}

export interface ItemBalancing extends Asset {
  itemConfig?: ItemConfigData;
}

export interface Item extends Asset {
  item?: ItemData;
  itemEffect?: ItemEffect;
  expeditionAttribute?: ExpeditionAttribute;
  itemAction?: ItemAction;
  specialAction?: SpecialAction;
  upgrade?: UpgradeData;
  buff?: BuffData;
}

export interface QuestItem extends Item {
}

export interface ItemWithUI extends Item {
}

export interface ItemSpecialAction extends Item {
}

export interface QuestItemMagistrate extends Item {
}

export interface FestivalBuff extends Item {
}

export interface GuildhouseBuff extends Item {
}

export interface TownhallBuff extends Item {
}

export interface VehicleBuff extends Item {
}

export interface HarbourOfficeBuff extends Item {
}

export interface CultureItem extends Item {
}

export interface TownhallItem extends Item {
}

export interface GuildhouseItem extends Item {
}

export interface HarborOfficeItem extends Item {
}

export interface ShipSpecialist extends Item {
}

export interface VehicleItem extends Item {
}

export interface ActiveItem extends Item {
}

export interface ItemSpecialActionVisualEffect extends Item {
}

export interface FluffItem extends Item {
}

export interface StartExpeditionItem extends Item {
}

export interface ItemConstructionPlan extends Item {
}

export interface OrnamentalBuilding extends Building {
  ornament?: OrnamentData;
}

export interface BuildPermitBuilding extends OrnamentalBuilding {
}

export interface QuestLighthouse extends Building {
}

export interface ParticipantRepresentationFeature extends Asset {
  participant?: ParticipantRepresentationFeatureData;
}

export interface ProductionChain extends Asset {
  chain?: ProductionChainNode;
}

export interface Product extends Asset {
  product?: ProductData;
  expeditionAttribute?: ExpeditionAttribute;
}

export interface Projectile extends Asset {
  projectile?: ProjectileData;
  projectileIncident?: ProjectileIncident;
}

export interface ExplodingProjectile extends Projectile {
  exploder?: ExploderData;
}

export interface PublicServiceBuilding extends Building {
  publicService?: PublicServiceData;
}

export interface Market extends PublicServiceBuilding {
  market?: MarketData;
  storedProducts: number[];
}

export interface Region extends Asset {
  region: RegionData;
}

export interface RepairCrane extends Building {
  maintenance?: MaintenanceData;
  repairCrane?: RepairCraneData;
}

export interface ResidenceBuilding7 extends Building {
  upgradable?: UpgradableData;
  residnece7?: Residence7;
}

export interface PopulationLevel7 extends Asset {
  population7?: Population7;
}

export interface PopulationGroup7 extends Asset {
  populationLevels: number[];
}

export interface Fertility extends Asset {
}

export interface ResourceSet extends Asset {
  resourceSetCondition?: ResourceSetCondition;
}

export interface FertilitySet extends ResourceSet {
  fertilities: number[];
}

export interface MineSlotSet extends ResourceSet {
  mineSlots: number[];
}

export interface Shipyard extends Building {
  maintenance?: MaintenanceData;
  electric?: ElectricData;
  shipyard?: ShipyardData;
}

export interface Text extends Asset {
}

export interface Icon extends Asset {
}

export interface NewspaperEffectIcon extends Icon {
  effectColor: string;
}

export interface PlayerLogo extends Asset {
  playerLogo: PlayerLogoData;
}

export interface Portrait extends Asset {
  portrait: PortraitData;
}

export interface Street extends Building {
  street?: StreetData;
}

export interface StreetBuilding extends Street {
}

export interface BridgeBuilding extends Building {
  bridge?: BridgeData;
}

export interface Warehouse extends Building {
  warehouse?: WarehouseData;
  queues: number;
  storedProducts: number[];
}

export interface HarborWarehouse7 extends Warehouse {
  upgradable?: UpgradableData;
  attacker?: AttackerData;
}

export interface HarborDepot extends Warehouse {
}

export interface HarborLandingStage7 extends Warehouse {
}

export interface HarborWarehouseStrategic extends Warehouse {
}

export interface BaseAssetObject {
}

export interface BuildingData extends BaseAssetObject {
  type: string;
  terrian: string;
  region: string;
  category: number;
  pickingAsset: number;
}

export interface UpgradableData extends BaseAssetObject {
  next: number;
  costs: CostPair[];
}

export interface CultureData extends BaseAssetObject {
  type: string;
  attractiveness: number;
  hasPollution: boolean;
  setPages: number[];
  openSetPages: number;
}

export interface SpecialUnitThreshold extends BaseAssetObject {
  unitAmount: number;
  happinessThreshold: number;
  populationCount: number;
}

export interface IncidentResolver extends BaseAssetObject {
  ResolverUnit: number;
  SpecialUnit: number;
  ResolvableIncident: string;
  specialUnitThresholds: SpecialUnitThreshold[];
}

export interface Influence extends BaseAssetObject {
  distance: number;
  influence: number;
}

export interface IncidentInfluencer extends BaseAssetObject {
  influence: Record<string, Influence>;
}

export interface ColorConfigData extends BaseAssetObject {
  text: Record<string, string>;
  slotGhost: Record<string, string>;
  questOutline: Record<string, string>;
  itemRarity: Record<string, string>;
  buildModeCurrentValidColor: string;
  buildModeCurrentInvalidColor: string;
  positiveValueColor: string;
  negativeValueColor: string;
  buildModeRadius: string;
  buildModeGridExtension: string;
  blueprintColor: string;
}

export interface EventLimit extends BaseAssetObject {
  minAmount: number;
  maxAmount: number;
  minAverageMoraleLoss: number;
  minThreats: number;
  maxThreats: number;
  maxMorale: number;
}

export interface FeedOptionPair extends BaseAssetObject {
  moraleFactor: number;
  product: number;
}

export interface FeedOption extends BaseAssetObject {
  options: FeedOptionPair[];
  factorOnUse: number;
  regainIfNotUsed: number;
}

export interface AttributeOptionPreparationLevel extends BaseAssetObject {
  threshold: number;
  name: number;
  description: number;
}

export interface ExpeditionFeatureData extends BaseAssetObject {
  eventLimits: Record<string, EventLimit>;
  feadOption: FeedOption;
  expeditionRegions: Record<string, number>;
  attributeNames: Record<string, number>;
  traits: Record<string, boolean>;
  attributeOptionPreparationLevels: AttributeOptionPreparationLevel[];
}

export interface ElectricData extends BaseAssetObject {
  boost: boolean;
  mandatory: boolean;
}

export interface FactoryInputOutputPair extends BaseAssetObject {
  product: number;
  amount: number;
  storage: number;
}

export interface FactoryData extends BaseAssetObject {
  cycleTime: number;
  inputs: FactoryInputOutputPair[];
  outputs: FactoryInputOutputPair[];
  warehouseTransporterAsset: number;
  productivityTimeMultiplier: number;
  productivityPoints: number;
  neededFertility: number;
}

export interface FreeAreaProductivity extends BaseAssetObject {
  radius: number;
  neededAreaPercent: number;
  worker: number;
  maxWorkers: number;
  workerPause: number;
  wayTime: number;
  freeAreaType: string;
  cutTree: boolean;
}

export interface ModuleOwnerData extends BaseAssetObject {
  options: number[];
  limit: number;
  radius: number;
}

export interface SlotData extends BaseAssetObject {
  type: string;
  workArea: number;
  snapsToSlot: boolean;
  category: number;
}

export interface MonumentData extends BaseAssetObject {
  upgradeTarget: number;
}

export interface ItemCategory extends BaseAssetObject {
  category: number;
  types: string[];
}

export interface ItemFilterData extends BaseAssetObject {
  categories: ItemCategory[];
}

export interface ProductCategory extends BaseAssetObject {
  category: number;
  products: number[];
}

export interface ProductFilterData extends BaseAssetObject {
  categories: ProductCategory[];
}

export interface ItemConfigData extends BaseAssetObject {
  rarityText: Record<string, number>;
  exclusiveGroupText: Record<string, number>;
  allocationText: Record<string, number>;
  allocationIcons: Record<string, string>;
  itemGenCrateAsset: number;
  itemGenCrateScale: number;
  buffFluffIndexIncreaseTimer: number;
}

export interface BuffData extends BaseAssetObject {
  addedInfolayer: number;
  possibleFluffTexts: number[];
}

export interface ItemData extends BaseAssetObject {
  flotsam: number;
  allocation: string;
  maxStackSize: number;
  rarity: string;
  hasAction: boolean;
  tradePrice: boolean;
  transferBlocked: boolean;
  itemType: boolean;
  itemSet: number;
  exclusiveGroup: string;
  isDestroyedOnUnequip: boolean;
}

export interface ItemEffect extends BaseAssetObject {
  targets: number[];
}

export interface ItemAction extends BaseAssetObject {
  target: number;
  distance: number;
  cooldown: number;
  description: number;
  stopMovementOnInteraction: boolean;
  scope: string;
  repairSpeed: number;
  duration: number;
  buff: number;
  canEnd: boolean;
  incidentTypes: string[];
  isDestroyedAfterCooldown: boolean;
  radiusBuffTargets: string[];
}

export interface SpecialAction extends BaseAssetObject {
  projectile: number;
  barrageCount: number;
  barrageDuration: number;
  actionRadius: number;
  delay: number;
}

export interface UpgradePair extends BaseAssetObject {
  value: number;
  percental: boolean;
}

export interface InputBenefitModifier extends BaseAssetObject {
  product: number;
  additionalMoney: number;
}

export interface OverrideIncidentAttractiveness extends BaseAssetObject {
  attractiveness: number;
  overrideEnabled: boolean;
}

export interface GoodConsumptionUpgrade extends BaseAssetObject {
  providedNeed: number;
  amountInPercent: number;
}

export interface NeedProvideNeedUpgrade extends BaseAssetObject {
  providedNeed: number;
  substituteNeed: number;
}

export interface ChangedSupplyValueUpgrade extends BaseAssetObject {
  need: number;
  amountInPercent: number;
}

export interface AdditionalOutput extends BaseAssetObject {
  product: number;
  cycle: number;
  amount: number;
}

export interface ReplaceInput extends BaseAssetObject {
  oldInput: number;
  newInput: number;
}

export interface InputAmountUpgrade extends BaseAssetObject {
  product: number;
  amount: number;
}

export interface AddStatusEffect extends BaseAssetObject {
  effect: number;
  duration: number;
}

export interface ReplaceAssemblyOption extends BaseAssetObject {
  oldOption: number;
  newOption: number;
}

export interface UpgradeData extends BaseAssetObject {
  changeModule: number;
  forcedFeedbackVariation: number;
  additionalModuleSoundLoop: number;
  replacingWorkforce: number;
  additionalHappiness: number;
  taxModifierInPercent: number;
  workforceModifierInPercent: number;
  addedFertility: number;
  needsElectricity: boolean;
  provideElectricity: boolean;
  attackSpeedUpgrade: number;
  useProjectile: number;
  genProbability: number;
  genPool: number;
  ConstructionCostInPercent: number;
  ConstructionTimeInPercent: number;
  activateWhiteFlag: boolean;
  activatePirateFlag: boolean;
  happinessIgnoresMorale: boolean;
  blockHostileTakeover: boolean;
  blockBuyShare: boolean;
  activeTradePriceInPercent: number;
  inputBenefitModifier: InputBenefitModifier[];
  goodConsumptionUpgrade: GoodConsumptionUpgrade[];
  needProvideNeedUpgrade: NeedProvideNeedUpgrade[];
  changedSupplyValueUpgrade: ChangedSupplyValueUpgrade[];
  overrideIncidentAttractiveness: Record<string, OverrideIncidentAttractiveness>;
  additionalOutput: AdditionalOutput[];
  replaceInputs: ReplaceInput[];
  inputAmountUpgrade: InputAmountUpgrade[];
  addStatusEffects: AddStatusEffect[];
  damageFactor: Record<string, number>;
  moraleDamage: number[];
  hitpointDamage: number[];
  addAssemblyOptions: number[];
  replaceAssemblyOptions: ReplaceAssemblyOption[];
  damageReceiveFactor: Record<string, number>;
  upgrades?: Record<string, UpgradePair>;
}

export interface AttackableData extends BaseAssetObject {
  maximumHitPoints: number;
  hasRuinState: boolean;
  selfHealPerHealTick: number;
  pausedTimeIfAttacked: boolean;
  canBeAttackedByPlayer: boolean;
  moralePower: number;
  isInvulnerable: boolean;
  militaryDefensePoints: number;
  accuracyWidth: number;
  selfHealPausedTimeIfAttacked: number;
  armorType: string;
  disableGettingAutoAttacked: boolean;
}

export interface AttackerData extends BaseAssetObject {
  type: string;
  range: number;
  attackRangeApproachPercentage: number;
  lineOfSightRange: number;
  reloadTime: number;
  projectile: number;
  baseDamage: number;
  accuracyBase: number;
  accuracyIncreaseOverDistance: number;
  accuracySpeedDecay: number;
  emitProjectileTimeAfterStartAnimation: number;
  targetAngleVariation: number;
  shootingTracking: string;
  projectileCount: number;
  turrets: number[];
}

export interface CostPair extends BaseAssetObject {
  ingredient: number;
  amount: number;
}

export interface CostData extends BaseAssetObject {
  costs: CostPair[];
  influenceCostType: string;
  influenceCostPoints: number;
}

export interface MaintenancePair extends BaseAssetObject {
  product: number;
  amount: number;
  inactiveAmount: number;
  shutdownThreshold: number;
}

export interface MaintenanceData extends BaseAssetObject {
  maintenances: MaintenancePair[];
  consumerPriority: number;
}

export interface OrnamentData extends BaseAssetObject {
  unit: number;
  description: number;
}

export interface CompanyLevelData extends BaseAssetObject {
  populationCountOffset: number;
  populationFactor: number;
  exponent: number;
  secondLevel: number;
  secondPopulationFactor: number;
  secondExponent: number;
}

export interface ParticipantRepresentationFeatureData extends BaseAssetObject {
  companyLevel?: CompanyLevelData;
  colors: string[];
}

export interface ProductionChainNode extends BaseAssetObject {
  building: number;
  nodes?: ProductionChainNode[];
}

export interface ProductData extends BaseAssetObject {
  negative: boolean;
  category: number;
  isWorkforce: boolean;
  isAbstract: boolean;
  regions: string[];
  basePrice: number;
  civLevel: number;
}

export interface ExpeditionAttributePair extends BaseAssetObject {
  attribute: string;
  amount: number;
}

export interface ExpeditionAttribute extends BaseAssetObject {
  attributes: ExpeditionAttributePair[];
  baseMorale: number;
  fluff: string[];
  itemDifficulties: string[];
  itemRegions: string[];
}

export interface ProjectileEffectivitie extends BaseAssetObject {
  guid: number;
  factor: number;
}

export interface StatusEffect extends BaseAssetObject {
  effect: number;
  duration: number;
}

export interface ProjectileData extends BaseAssetObject {
  type: string;
  shotHeight: number;
  speed: number;
  ShotAngle: number;
  targetWhiteList: string[];
  effectivities: ProjectileEffectivitie[];
  statusEffects: StatusEffect[];
}

export interface ProjectileIncident extends BaseAssetObject {
  causedIncident: string;
  causedIncidentBuff: number;
  causedIncidentDuration: number;
}

export interface ExploderData extends BaseAssetObject {
  innerDamageRadius: number;
  outerDamageRadius: number;
  minimumDamage: number;
  innerDamage: number;
  debrisForceY: number;
  debrisCount: number;
  FriendlyFireFactor: number;
}

export interface PublicServiceData extends BaseAssetObject {
  fullSatisfactionDistance: number;
  noSatisfactionDistance: number;
  publicServiceOutputs: number[];
  functionDescription: number;
}

export interface MarketData extends BaseAssetObject {
  fullSupplyDistance: number;
  noSupplyDistance: number;
}

export interface RegionData extends BaseAssetObject {
  populationGroup: number;
  cityNames: number[];
  shipNames: number[];
}

export interface RepairCraneData extends BaseAssetObject {
  healRadius: number;
  healPerMinute: number;
  healBuildingsPerMinute: number;
}

export interface InfluenceGeneration extends BaseAssetObject {
  gain: number;
  keep: number;
}

export interface Residence7 extends BaseAssetObject {
  population: number;
  max: number;
  influenceGenerations: InfluenceGeneration[];
}

export interface PopulationInput extends BaseAssetObject {
  product: number;
  amount: number;
  supply: number;
  happiness: number;
  mouney: number;
  full: number;
  no: number;
}

export interface PopulationOutput extends BaseAssetObject {
  product: number;
  amount: number;
}

export interface Population7 extends BaseAssetObject {
  inputs: PopulationInput[];
  outputs: PopulationOutput[];
  categoryIcon: string;
  moods?: Record<string, number>;
}

export interface ResourceSetCondition extends BaseAssetObject {
  priority: number;
  allowedRegion: string;
  allowedIslandType: string[];
  allowedIslandDifficulty: string[];
  allowedResourceAmounts: string[];
}

export interface ShipyardData extends BaseAssetObject {
  assemblyOptions: number[];
}

export interface PlayerLogoData extends BaseAssetObject {
  defaultLogo: string;
  miniLogo: string;
}

export interface PortraitData extends BaseAssetObject {
  name: number;
  color: string;
  isFemale: boolean;
}

export interface StreetData extends BaseAssetObject {
  bridge: number;
}

export interface BridgeData extends BaseAssetObject {
  minLength: number;
  maxLength: number;
}

export interface WarehouseData extends BaseAssetObject {
  type: string;
  storage: number;
}
