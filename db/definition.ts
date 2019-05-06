/* eslint-disable */

export interface Asset {
  guid: number;
  name: string;
  id: string;
  icon: string;
  description?: number;
}

export interface BridgeBuilding extends Building {
  bridge?: BridgeData;
}

export interface Building extends Asset {
  building?: BuildingData;
  cost?: CostData;
}

export interface ColorConfig extends Building {
  colorConfig?: ColorConfigData;
}

export interface FactoryBuilding7 extends Building {
  maintenance?: MaintenanceData;
  neededFertility: number;
  factory?: FactoryData;
  culture?: CultureData;
  electric?: ElectricData;
}

export interface FarmBuilding extends FactoryBuilding7 {
  moduleOwner?: ModuleOwnerData;
}

export interface Farmfield extends Building {
}

export interface FreeAreaBuilding extends FactoryBuilding7 {
  freeAreaProductivity?: FreeAreaProductivity;
}

export interface HarborDepot extends Warehouse {
}

export interface HarborWarehouse7 extends Warehouse {
}

export interface HarborWarehouseStrategic extends Warehouse {
}

export interface HeavyFactoryBuilding extends FactoryBuilding7 {
}

export interface HeavyFreeAreaBuilding extends FreeAreaBuilding {
}

export interface Market extends Building {
  market?: MarketData;
  storedProducts: number[];
}

export interface Monument extends FactoryBuilding7 {
  monument?: MonumentData;
}

export interface OilPumpBuilding extends Slot {
}

export interface ParticipantRepresentationFeature extends Asset {
  participant?: ParticipantRepresentationFeatureData;
}

export interface PopulationLevel7 extends Asset {
  population7?: Population7;
}

export interface PowerplantBuilding extends FactoryBuilding7 {
}

export interface Product extends Asset {
  product?: ProductData;
}

export interface ProductionChain extends Asset {
  chain?: ProductionChainNode;
}

export interface ResidenceBuilding7 extends Building {
  upgradable?: UpgradableData;
  residnece7?: Residence7;
}

export interface Slot extends Building {
  slot?: SlotData;
}

export interface SlotFactoryBuilding7 extends FactoryBuilding7 {
  slot?: SlotData;
}

export interface Street extends Building {
  street?: StreetData;
}

export interface StreetBuilding extends Street {
}

export interface Warehouse extends Building {
  warehouse?: WarehouseData;
  queues: number;
  storedProducts: number[];
}

export interface BaseAssetObject {
}

export interface BridgeData extends BaseAssetObject {
  minLength: number;
  maxLength: number;
}

export interface BuildingData extends BaseAssetObject {
  type: string;
  terrian: string;
  region: string;
  category?: number;
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

export interface ModuleOwnerData extends BaseAssetObject {
  options: number[];
  limit: number;
  radius: number;
}

export interface ElectricData extends BaseAssetObject {
  boost: boolean;
  mandatory: boolean;
}

export interface ColorConfigData extends BaseAssetObject {
  text: Record<string,string>;
  slotGhost: Record<string,string>;
  questOutline: Record<string,string>;
  itemRarity: Record<string,string>;
  buildModeCurrentValidColor: string;
  buildModeCurrentInvalidColor: string;
  positiveValueColor: string;
  negativeValueColor: string;
  buildModeRadius: string;
  buildModeGridExtension: string;
  blueprintColor: string;
}

export interface FactoryInputOutputPair extends BaseAssetObject {
  product: number;
  amount: number;
  storage: number;
}

export interface FactoryData extends BaseAssetObject {
  inputs: FactoryInputOutputPair[];
  outputs: FactoryInputOutputPair[];
  cycleTime: number;
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

export interface MarketData extends BaseAssetObject {
  fullSupplyDistance: number;
  noSupplyDistance: number;
}

export interface CostPair extends BaseAssetObject {
  ingredient: number;
  amount: number;
}

export interface CostData extends BaseAssetObject {
  costs: CostPair[];
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

export interface MonumentData extends BaseAssetObject {
  upgradeTarget: number;
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

export interface MoodText extends BaseAssetObject {
  angry: number;
  unhappy: number;
  neutral: number;
  happy: number;
  euphoric: number;
}

export interface Population7 extends BaseAssetObject {
  inputs: PopulationInput[];
  outputs: PopulationOutput[];
  categoryIcon: string;
  moods?: MoodText;
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

export interface ProductionChainNode extends BaseAssetObject {
  building: number;
  nodes?: ProductionChainNode[];
}

export interface Residence7 extends BaseAssetObject {
  population: number;
  max: number;
}

export interface SlotData extends BaseAssetObject {
  type: string;
  workArea: number;
  snapsToSlot: boolean;
  category: number;
}

export interface StreetData extends BaseAssetObject {
  bridge: number;
}

export interface WarehouseData extends BaseAssetObject {
  type: string;
  storage: number;
}
