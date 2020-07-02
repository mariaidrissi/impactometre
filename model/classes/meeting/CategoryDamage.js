'use strict';

const Hardware = require('./Hardware');
const Damage = require('../shared/Damage');
const Journey = require('./Journey');
const Software = require('./Software');
const {
  meetingCategoryDamage
} = require('../../../constants/meeting');

class CategoryDamage {
  /**
   * Create a damage synthesis for all meeting components from the same category (hardware, software or transport).
   * It's composed of a total damage that is the sum of each component damage
   * and of an array that contains all the component damages.
   * @param {Object[]} components - An array of JSON objects that contains all necessary data to create the components of the category.
   * @param {String} category - The category of the given components.
   */
  constructor ({ components, category }) {
    this._category = category;

    // Create a hashmap that contains components and their id
    this._components = this.arrayToMapComponents(components, category);
  }

  // Getters

  /**
   * Getter of the total category damage.
   */
  get totalDamage () {
    return this._totalDamage;
  }

  /**
   * Getter of the hasmhap that contains all the components indexed by a their id.
   */
  get components () {
    return this._components;
  }

  /**
   * Getter of The category of the components wich caused the damage.
   */
  get category () {
    return this._category;
  }

  // Setters

  /**
   * Setter of the total category damage.
   */
  set totalDamage (totalDamage) {
    this._totalDamage = totalDamage;
  }

  /**
   * setter of the hasmhap that contains all the components indexed by a their id.
   */
  set components (components) {
    this._components = components;
  }

  /**
   * Setter of The category of the components wich caused the damage.
   */
  set category (category) {
    this._category = category;
  }

  // Other methods

  /**
   * From an array that contains all necessary data,
   * Create a hashmap of components (hardware, software or journeys) indexed by their id
   * @param {Object[]} components - An array of JSON objects that contain all necessary data to create the components of the meeting.
   * @param {String} category - The category of the components that caused the damage.
   */
  arrayToMapComponents (components, category) {
    // The hashmap that will contain components indexed by their id
    const componentsMap = new Map();

    switch (category) {
      case meetingCategoryDamage.HARDWARE:
        components.forEach(c => {
          const component = new Hardware(c);
          componentsMap.set(component.name, component);
        });
        break;
      case meetingCategoryDamage.SOFTWARE:
        components.forEach(c => {
          const component = new Software(c);
          componentsMap.set(component.name, component);
        });
        break;
      case meetingCategoryDamage.JOURNEY:
        components.forEach(c => {
          const component = new Journey(c);
          componentsMap.set(component.mean, component);
        });
        break;
    }

    return componentsMap;
  }

  /**
   * Compute the damage caused by each component of the categoryDamage object and
   * initialize the total damage caused by all these components.
   * @param payload - A JSON object that contains all necessary data to compute
   * the damage caused by each component of the categoryDamage (hardware, software, journeys).
   */
  async computeDamage (payload = {}) {
    this.totalDamage = new Damage();

    // Compute the damage caused by each component of the categoryDamage object
    // and add it to the totalDamage caused by the components of the categoryDamage object.
    for (const [_, c] of this.components) {
      await c.computeDamage(payload);
      this.totalDamage = await this.totalDamage.add(c.damage);
    };

    return Promise.resolve(this.totalDamage);
  }

  /**
   *
   * @param {Object} components - A JSON object that contains all necessary data to update all meeting components from a category.
   * @param {String} category - The components category (hardware, software or journey)
   */
  update ({ components, category }) {
    switch (category) {
      case meetingCategoryDamage.HARDWARE:
        components.forEach(component => {

        });
        break;
      case meetingCategoryDamage.SOFTWARE:
        break;
      case meetingCategoryDamage.JOURNEY:
        break;
    }
  }
}

module.exports = CategoryDamage;
