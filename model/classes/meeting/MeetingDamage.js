'use strict';

const CategoryDamage = require('./CategoryDamage');
const {
  meetingCategoryDamage
} = require('../../../constants/meeting');

class MeetingDamage {
  /**
   * Create a damage synthesis of a meeting.
   * It's composed of a Damage component that represents the total damage caused by the meeting
   * and of three CategoryDamage objects that repesent the damages caused by all
   * the meeting components gathered by category (hardware, software, transport).
   * @param {Object[]} hardware - An array of JSON objects that contain all necessary data to create the hardware components of the meeting.
   * @param {Object[]} software - An array of JSON objects that contain all necessary data to create the software components of the meeting.
   * @param {Object[]} journey - An array of JSON objects that contain all necessary data to create the transport components of the meeting.
   * @see CategoryDamage
   */
  constructor ({ hardware = null, software = null, journey = null }) {
    // Create all the category damages linked to the meeting
    this._hardwareDamage = new CategoryDamage({ components: hardware, category: meetingCategoryDamage.HARDWARE });
    this._softwareDamage = new CategoryDamage({ components: software, category: meetingCategoryDamage.SOFTWARE });
    this._journeyDamage = new CategoryDamage({ components: journey, category: meetingCategoryDamage.JOURNEY })
  }

  // Getters

  /**
   * Getter of the damage caused by hardware components.
   */
  get hardwareDamage () {
    return this._hardwareDamage
  }

  /**
   * Getter of the damage caused by software components.
   */
  get softwareDamage () {
    return this._softwareDamage
  }

  /**
   * Getter of the damage caused by transport components.
   */
  get journeyDamage () {
    return this._journeyDamage
  }

  /**
   * Getter of the total damage caused by the meeting.
   */
  get totalDamage () {
    return this._totalDamage
  }

  // Setters

  /**
   * Setter of the damage caused by hardware components.
   */
  set hardwareDamage (hardwareDamage) {
    this._hardwareDamage = hardwareDamage
  }

  /**
   * Setter of the damage caused by software components.
   */
  set softwareDamage (softwareDamage) {
    this._softwareDamage = softwareDamage
  }

  /**
   * Setter of the damage caused by transport components.
   */
  set journeyDamage (journeyDamage) {
    this._journeyDamage = journeyDamage
  }

  /**
   * Setter of the total damage caused by the meeting.
   */
  set totalDamage (totalDamage) {
    this._totalDamage = totalDamage
  }

  // Other methods

  /**
   * Compute the total damage caused by each category of components of the meeting and
   * initialize the total damage caused by all components of the meetings.
   * @param payload - A JSON object send by front end that contains all necessary data to compute
   * the damage caused by the meeting.
   */
  computeDamage (payload) {
    this.hardwareDamage.computeDamage(payload[meetingCategoryDamage.HARDWARE]);
    this.softwareDamage.computeDamage(payload[meetingCategoryDamage.SOFTWARE]);
    this.journeyDamage.computeDamage(payload[meetingCategoryDamage.JOURNEY]);

    // Compute the total damage caused by all the components of the meeting thanks to the
    // total damage caused by each category of components.
    this.totalDamage = this.softwareDamage.totalDamage.add(this.hardwareDamage.totalDamage).add(this.journeyDamage.totalDamage)
  }

  /**
   * Update the category damages (hardware, software, journey) of this meetingDamage object.
   * @param {Object[]} hardwareComponents - An array of JSON objects that contain all necessary data to update the hardware components of the meeting.
   * @param {Object[]} softwareComponents - An array of JSON objects that contain all necessary data to update the software components of the meeting.
   * @param {Object[]} journeyComponents - An array of JSON objects that contain all necessary data to update the transport components of the meeting.
   * @see CategoryDamage
   */
  update ({ hardwareComponents = {}, softwareComponents = {}, journeyComponents = {} }) {
    // For each category damage if the meeting damage isn't void, we update it

    if (hardwareComponents !== {}) {
      this.hardwareDamage.update({ components: hardwareComponents, category: meetingCategoryDamage.HARDWARE })
    }

    if (softwareComponents !== {}) {
      this.softwareDamage.update({ components: softwareComponents, category: meetingCategoryDamage.SOFTWARE })
    }

    if (journeyComponents !== {}) {
      this.journeyComponents.update({ components: journeyComponents, category: meetingCategoryDamage.JOURNEY })
    }
  }
}

module.exports = MeetingDamage;
