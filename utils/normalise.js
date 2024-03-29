'use strict';

const roundTo = require('round-to');
const {
  damageEndpoints,
  meetingCategoryDamage
} = require('../constants/meeting');

/**
 * Normalise the array
 * The biggest number is turned into 100, the other numbers are like percentages of the first one
 * example: [20, 18, 14, 6, 2] => [100, 90, 70, 30, 10].
 * The function is used to plot normalised damages.
 * @param {Integer[]} numbers - Array of numbers to normalise.
 */
function normalise (numbers) {
  // Sort the array, the biggest number is first
  numbers.sort((a, b) => b - a);
  const max = numbers[0];

  // Normalise the array
  const normalisedNumbers = numbers.map(number => (number / max) * 100);

  return normalisedNumbers;
}

/**
 * Normalised the damages values of several meeting scenarios.
 * The biggest number is turned into 100, the other numbers are like percentages of the first one
 * example:
 *  [
 *    {HUMAN_HEALTH, meetingScenario1, 20, 5, 5, 10},
 *    {ECOSYSTEM_QUALITY, meetingScenario1, 18, 2, 2, 14},
 *    {CLIMATE_CHANGE, meetingScenario1, 14, 5, 2, 7},
 *    {RESOURCES, meetingScenario1, 6, 2, 2, 2},
 *    {HUMAN_HEALTH, meetingScenario2, 2, 2, 0, 0}
 *  ] => [
 *    {HUMAN_HEALTH, meetingScenario1, 100, 25, 25, 50},
 *    {ECOSYSTEM_QUALITY, meetingScenario1, 90, 10, 10, 70},
 *    {CLIMATE_CHANGE, meetingScenario1, 70, 25, 10, 35},
 *    {RESOURCES, meetingScenario1, 30, 10, 10, 10},
 *    {HUMAN_HEALTH, meetingScenario2, 10, 10, 0, 0}
 *  ]
 * The function is used to plot normalised damages.
 * @param {Object} meetingScenarios - Iterable object thats contains meetingScenarios we want to normalise the damage values
 * @returns An array that contains JSON objects (like {ECOSYSTEM_QUALITY, meetingScenario1, 90})
 * normaised by their damage values and ordered.
 */
async function normaliseDamages (meetingScenarios) {
  let humanHealthDamages = [];
  let ecosystemQualityDamages = [];
  let climateChangeDamages = [];
  let resourcesDamages = [];

  const normalisedDamages = {};

  // For each meeting scenario, get the values for each damage end point
  // (human health, ecosysteme quality, climate change and resources) of its total damage
  // and its values for all damage category (hardware, software, jounrney)
  for (const meetingScenario of meetingScenarios) {
    humanHealthDamages = humanHealthDamages.concat(
      [{
        damageEndpoint: damageEndpoints.HUMAN_HEALTH,
        meetingScenario: meetingScenario.id,
        value: meetingScenario.damage.totalDamage.humanHealth,
        [meetingCategoryDamage.HARDWARE]: meetingScenario.damage.hardwareDamage.totalDamage.humanHealth,
        [meetingCategoryDamage.SOFTWARE]: meetingScenario.damage.softwareDamage.totalDamage.humanHealth,
        [meetingCategoryDamage.JOURNEY]: meetingScenario.damage.journeyDamage.totalDamage.humanHealth
      }]
    );
    ecosystemQualityDamages = ecosystemQualityDamages.concat(
      [{
        damageEndpoint: damageEndpoints.ECOSYSTEM_QUALITY,
        meetingScenario: meetingScenario.id,
        value: meetingScenario.damage.totalDamage.ecosystemQuality,
        [meetingCategoryDamage.HARDWARE]: meetingScenario.damage.hardwareDamage.totalDamage.ecosystemQuality,
        [meetingCategoryDamage.SOFTWARE]: meetingScenario.damage.softwareDamage.totalDamage.ecosystemQuality,
        [meetingCategoryDamage.JOURNEY]: meetingScenario.damage.journeyDamage.totalDamage.ecosystemQuality
      }]
    );
    climateChangeDamages = climateChangeDamages.concat(
      [{
        damageEndpoint: damageEndpoints.CLIMATE_CHANGE,
        meetingScenario: meetingScenario.id,
        value: meetingScenario.damage.totalDamage.climateChange,
        [meetingCategoryDamage.HARDWARE]: meetingScenario.damage.hardwareDamage.totalDamage.climateChange,
        [meetingCategoryDamage.SOFTWARE]: meetingScenario.damage.softwareDamage.totalDamage.climateChange,
        [meetingCategoryDamage.JOURNEY]: meetingScenario.damage.journeyDamage.totalDamage.climateChange
      }]
    );
    resourcesDamages = resourcesDamages.concat(
      [{
        damageEndpoint: damageEndpoints.RESOURCES,
        meetingScenario: meetingScenario.id,
        value: meetingScenario.damage.totalDamage.resources,
        [meetingCategoryDamage.HARDWARE]: meetingScenario.damage.hardwareDamage.totalDamage.resources,
        [meetingCategoryDamage.SOFTWARE]: meetingScenario.damage.softwareDamage.totalDamage.resources,
        [meetingCategoryDamage.JOURNEY]: meetingScenario.damage.journeyDamage.totalDamage.resources
      }]
    );
  }

  const damages = [humanHealthDamages, ecosystemQualityDamages, climateChangeDamages, resourcesDamages];

  for (const damage of damages) {
    damage.sort((a, b) => b.value - a.value);
    const max = damage[0].value;

    /* Normalised the damage values
    The biggest number is turned into 100, the other numbers are like percentages of the first one
    example:
    [
      {HUMAN_HEALTH, meetingScenario1, 20, 5, 5, 10},
      {ECOSYSTEM_QUALITY, meetingScenario1, 18, 2, 2, 14},
      {CLIMATE_CHANGE, meetingScenario1, 14, 5, 2, 7},
      {RESOURCES, meetingScenario1, 6, 2, 2, 2},
      {HUMAN_HEALTH, meetingScenario2, 2, 2, 0, 0}
    ] => [
      {HUMAN_HEALTH, meetingScenario1, 100, 25, 25, 50},
      {ECOSYSTEM_QUALITY, meetingScenario1, 90, 10, 10, 70},
      {CLIMATE_CHANGE, meetingScenario1, 70, 25, 10, 35},
      {RESOURCES, meetingScenario1, 30, 10, 10, 10},
      {HUMAN_HEALTH, meetingScenario2, 10, 10, 0, 0}
    ]
    */
    for (const d of damage) {
      const x = {
        damageEndpoint: d.damageEndpoint,
        meetingScenario: d.meetingScenario,
        value: roundTo((d.value / max) * 100, 2) || 0,
        [meetingCategoryDamage.HARDWARE]: roundTo((d.hardware / max) * 100, 2) || 0,
        [meetingCategoryDamage.SOFTWARE]: roundTo((d.software / max) * 100, 2) || 0,
        [meetingCategoryDamage.JOURNEY]: roundTo((d.journey / max) * 100, 2) || 0
      };
      normalisedDamages[d.damageEndpoint] = normalisedDamages[d.damageEndpoint] || {};
      normalisedDamages[d.damageEndpoint][d.meetingScenario] = x;
    };
  };
  return Promise.resolve(normalisedDamages);
}

module.exports = { normalise, normaliseDamages };
