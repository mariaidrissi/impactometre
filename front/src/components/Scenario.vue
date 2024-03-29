<template>
  <div class="scenario">
    <div v-if="active" class="scenario-full">
      <div class="scenario-header" :id="title.replace(/\s/g, '')">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click.prevent="deleteScenario">
          &#10006;
        </button>
      </div>
      <div class="scenario-body">
        <div class="scenario-section">
          <div class="scenario-section-body">
            <div class="scenario-line">
              <span class="scenario-line-caption">
                <p>Nombre de participants</p>
              </span>
              <IncrementButton
                v-model="scenario.numberOfParticipants"
                :max="30"
                :min="1"
                class="align-right participants-no-btn"
              /><br />
              <hr />
            </div>
            <div class="scenario-line">
              <span class="scenario-line-caption">
                <p>Durée de la réunion (minutes)</p>
              </span>
              <IncrementButton
                v-model="scenario.meetingDuration"
                :max="999"
                :min="1"
                class="align-right"
              /><br />
              <hr />
            </div>
          </div>
        </div>
        <div class="scenario-section">
          <div class="scenario-section-header">Matériel</div>
          <div class="scenario-section-body">
            <div
              class="scenario-line"
              v-for="h in scenario.hardware"
              :key="h.name"
            >
              <span class="scenario-line-caption">
                <p>
                  {{ h.french }}
                </p>
              </span>
              <IncrementButton
                v-model="h.qty"
                :max="99"
                class="align-right"
              /><br />
              <hr />
            </div>
          </div>
        </div>
        <div class="scenario-section">
          <div class="scenario-section-header">Réseau</div>
          <div class="scenario-section-body">
            <div class="scenario-line">
              <span class="scenario-line-caption">
                <p>Logiciel de visioconférence</p>
                <select v-model="scenario.software.name" class="align-right">
                  <option value="">Aucun</option>
                  <option
                    v-for="software_option in software_options"
                    :key="software_option.name"
                    :value="software_option.name"
                  >
                    {{ software_option.french }}
                  </option>
                </select>
              </span>
            </div>
          </div>
        </div>
        <div class="scenario-section journey">
          <div class="scenario-section-header">
            Trajets véhiculés
            <button class="add-journey-btn" @click.prevent="addJourney">
              +
            </button>
          </div>
          <div class="scenario-section-body">
            <div
              class="scenario-line journey"
              v-for="j in scenario.journey"
              :key="j.length"
            >
              <IncrementButton
                v-model="j.distance"
                :max="99"
                class="flex-item"
              />
              <p class="flex-item">km en</p>
              <select v-model="j.mean" class="select-journey flex-item">
                <option disabled value="">Choisissez</option>
                <option
                  v-for="journey_option in journey_options"
                  :key="journey_option.name"
                  :value="journey_option.name"
                >
                  {{ journey_option.french }}
                </option>
              </select>
              <button
                class="delete-journey-btn flex-item"
                @click.prevent="deleteJourney(j)"
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="scenario-empty">
      <div class="scenario-header"></div>
      <div class="scenario-body">
        <img
          src="../assets/img/add_scenario_button.svg"
          @click.prevent="createScenario"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IncrementButton from "./IncrementButton";
import Tooltip from "./Tooltip";

import { software_options, journey_options } from "../options/options.js";

function initialScenario() {
  return {
    meetingDuration: 1,
    numberOfParticipants: 1,
    hardware: [
      {
        name: "LAPTOP",
        french: "Ordinateurs portables",
        qty: 0,
      },
      {
        name: "DESKTOP",
        french: "Ordinateurs fixes",
        qty: 0,
      },
      {
        name: "LOGITECH_KIT",
        french: "Kits de vidéo-conférence",
        qty: 0,
      },
      {
        name: "COMPUTER_SCREEN_LCD",
        french: "Ecrans supplémentaires",
        qty: 0,
      },
      {
        name: "PROJECTOR",
        french: "Vidéo-projecteurs",
        qty: 0,
      },
    ],
    software: {
      name: "",
    },
    journey: [],
  };
}

export default {
  name: "Scenario",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  components: {
    IncrementButton,
    Tooltip,
  },
  data() {
    return {
      active: false,
      software_options,
      journey_options,
      scenario: {},
    };
  },
  methods: {
    createScenario() {
      this.scenario = initialScenario();
      this.scenario.meetingScenario = this.title;
      this.active = true;
    },
    deleteScenario() {
      this.scenario = initialScenario();
      this.scenario.meetingScenario = this.title;
      this.active = false;
    },
    addJourney() {
      //TODO: Add a journey only if last if not empty
      this.scenario.journey.push({
        distance: 0,
        mean: "",
      });
    },
    deleteJourney(journey) {
      this.scenario.journey = this.scenario.journey.filter((j) => j != journey);
    },
  },
  mounted() {
    var cookie = JSON.parse(localStorage.getItem(this.title));
    if (cookie) {
      this.active = cookie[0];
      this.scenario = cookie[1];
    }
    this.$root.$on("retrieveScenarios", (data) => {
      if (this.active) {
        data.push(this.scenario);
      }
    });
  },
  updated() {
    localStorage.setItem(
      this.title,
      JSON.stringify([this.active, this.scenario])
    );
  },
};
</script>

<style>
.scenarios {
  display: flex;
}

.scenario {
  margin: 0 10px;
  flex-basis: 75%;
  max-width: 33%;
}

/*
 *    SCENARIO-FULL
 */

.scenario-full {
  height: auto;
  min-height: 80%;
  margin: 30px 10px;
  flex: 1 1 auto;
  border-radius: 15px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  /* padding-bottom:25px; */
}
.scenario-full .scenario-header {
  border-radius: 15px 15px 0 0;
  height: 60px;
}
#ScenarioA {
  background-color: #e97272;
}
#ScenarioB {
  background-color: #e7dc73;
}
#ScenarioC {
  background-color: #83bdec;
}
.scenario-full .scenario-header h2 {
  text-align: center;
  font-style: normal;
  font-size: 25px;
  line-height: 60px;
}
.scenario-full hr {
  margin-top: 10px;
  border: 2px dashed #e3e3e3;
  border-style: none none dashed;
}
/*
 * CLOSE LINK
 */

.close-btn {
  display: inline-block;
  position: relative;
  float: right;
  top: -46px;
  left: -12px;
  border: none;
  color: black;
  padding: 5px 8px;
  border-radius: 7px;
  background-color: transparent;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
}
.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.delete-journey-btn {
  display: inline;
  top: -46px;
  left: -12px;
  padding-left: 10px;
  padding-right: 20px;
  border: none;
  color: gray;
  background-color: transparent;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  left: -19.5px;
  top: 0px;
  font-weight: 400;
}

.delete-journey-btn:hover {
  color: black;
  cursor: pointer;
}

/*
 *    SCENARIO-SECTIONS AND SCENARIO-LINES
 */
.scenario-section {
  margin-bottom: 20px;
}
.scenario-section-header {
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  margin: 15px 15px 20px 20px;
}

.scenario-section.journey {
  padding-bottom: 20px;
}

.scenario-line {
  margin: 10px;
  margin-left: 25px;
}

.scenario-line-caption p {
  display: inline-block;
  max-width: 50%;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: #363636;
}
.scenario-section.journey {
}

.scenario-line.journey {
  display: flex;
}
.flex-item {
  flex: 1 0.5 auto;
}
.scenario-line-caption .helper {
}
.select-journey {
  max-width: 40%;
}
/*
 *    BUTTONS
 */
.align-right {
  float: right;
  margin-right: 15px;
}
.participants-no-btn {
  margin-right: -6px;
}
.scenario-line select {
  max-width: 35%;
  border-width: 1px;
  border-style: solid;
  border-color: #bcbcbc;
  border-radius: 6px;
  font-size: 14px;
  background: none;
  color: black;
  padding: 2px 2px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}
.add-journey-btn {
  border: none;
  background: #dcdcdc;
  border-radius: 15px;
  color: #676767;
  padding: 5px 10px;
  margin-left: 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
}
.add-journey-btn:hover {
  background: #b6b6b6;
}
/*
 *    SCENARIO-EMPTY
 */
.scenario-body {
  margin-top: 20px;
}
.scenario-empty {
  /* height: 80%; */
  min-height: 80%;
  margin: 30px 10px;
  flex: 1 1 auto;
  border-radius: 15px;
  box-sizing: border-box;
  border: 1px dashed #000000;
}

.scenario-empty .scenario-body img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 60%;
  transition-timing-function: ease;
  width: 50px;
}
.scenario-empty .scenario-body img:hover {
  transition-timing-function: ease;

  transform: scale(1.05, 1.05);
  cursor: pointer;
}
</style>
