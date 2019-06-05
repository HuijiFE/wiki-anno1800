import { CompanyLevelData } from '@public/db/definition';

export const INFLUENCE_BASE = 100;
export const INFLUENCE_PER_LEVEL = 15;
export const INFLUENCE_PER_INVESTOR_RESIDENT = 2;

export function getGlobalPopulationForCorporationLevel(
  data: CompanyLevelData,
  level: number,
): number {
  if (level <= 0) {
    return 0;
  }

  let population =
    data.populationCountOffset + level ** data.exponent * data.populationFactor;
  if (level > data.secondLevel) {
    const secondPopulation =
      data.populationCountOffset +
      data.secondLevel ** data.exponent * data.populationFactor +
      (level - data.secondLevel) ** data.secondExponent * data.secondPopulationFactor;
    population = Math.round(Math.max(population, secondPopulation) / 10.0) * 10.0;
  }
  return population;
}

export function getCorporationLevelForGlobalPopulation(
  data: CompanyLevelData,
  population: number,
): number {
  if (population < 0) {
    return 0;
  }

  for (let level = 1; level < 999; level++) {
    if (population < getGlobalPopulationForCorporationLevel(data, level)) {
      return level - 1;
    }
  }

  return 0;
}

export function getInfluenceForCorporationLevel(level: number): number {
  if (level <= 1) {
    return INFLUENCE_BASE;
  }
  return INFLUENCE_BASE + INFLUENCE_PER_LEVEL * (level - 1);
}
