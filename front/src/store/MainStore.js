import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let labels = ["A", "B", "C"];
let labels_detailled = ["Scenario A", "Scenario B", "Scenario C"];
let backgroundColor = ["#e97272", "#e7dc73", "#83bdec"];
let hoverBackgroundColor = [
  "rgba(0,0,0,0.8)",
  "rgba(0,0,0,0.6)",
  "rgba(0,0,0,0.3)",
];

var response = [
  [
    {
      damageEndpoint: "HUMAN_HEALTH",
      meetingScenario: "6mp34fkc3fqrkm",
      value: 25,
      hardware: 23,
      software: 12,
      journey: null,
    },
    {
      damageEndpoint: "HUMAN_HEALTH",
      meetingScenario: "6mp34fkc3fqrlf",
      value: 28,
      hardware: 11,
      software: 10,
      journey: 23,
    },
  ],
  [
    {
      damageEndpoint: "ECOSYSTEM_QUALITY",
      meetingScenario: "6mp34fkc3fqrkm",
      value: 30,
      hardware: 56,
      software: 2,
      journey: 13,
    },
    {
      damageEndpoint: "ECOSYSTEM_QUALITY",
      meetingScenario: "6mp34fkc3fqrlf",
      value: 20,
      hardware: 24,
      software: 23,
      journey: 12,
    },
  ],
  [
    {
      damageEndpoint: "CLIMATE_CHANGE",
      meetingScenario: "6mp34fkc3fqrkm",
      value: 12,
      hardware: 21,
      software: 23,
      journey: 14,
    },
    {
      damageEndpoint: "CLIMATE_CHANGE",
      meetingScenario: "6mp34fkc3fqrlf",
      value: 23,
      hardware: 21,
      software: 2,
      journey: 1,
    },
  ],
  [
    {
      damageEndpoint: "RESOURCES",
      meetingScenario: "6mp34fkc3fqrkm",
      value: 14,
      hardware: 2,
      software: 2,
      journey: 3,
    },
    {
      damageEndpoint: "RESOURCES",
      meetingScenario: "6mp34fkc3fqrlf",
      value: 25,
      hardware: 1,
      software: 1,
      journey: 3,
    },
  ],
];

const state = {
  api_loaded: false,
  scenarios_json: [],
  impact_on_spheres: {},
  impact_on_spheres_detailled: {},
};

let store = new Vuex.Store({
  state,
  mutations: {
    updateScenarios(state, scenarios) {
      state.scenarios_json = scenarios;
    },
    updateImpacts(state, impacts) {
      state.impact_on_spheres = impacts;
    },
    updateDetailledImpacts(state, impacts) {
      state.impact_on_spheres_detailled = impacts;
    },
    APIloaded(state) {
      state.api_loaded = true;
    },
    initImpact(state, damageEndpoint) {
      state.impact_on_spheres[damageEndpoint] = {
        labels,
        datasets: [
          {
            backgroundColor,
            data: [],
          },
        ],
      };
    },
    initDetailledImpact(state, damageEndpoint) {
      state.impact_on_spheres_detailled[damageEndpoint] = {
        labels: labels_detailled,
        datasets: [
          {
            label: "Matériel",
            data: [],
            backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor[0],
          },
          {
            label: "Réseau",
            data: [],
            backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor[1],
          },
          {
            label: "Trajets",
            data: [],
            backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor[2],
          },
        ],
      };
    },
  },
  actions: {
    callAPI({ commit }) {
      if (state.scenarios_json.length) {
        console.log(JSON.stringify(state.scenarios_json));
        // TODO: handle errors
        Vue.http.post("meeting").then(
          (response) => {
            console.log("ok");
            console.log(response);
          },
          (response) => {
            console.log("not ok");
          }
        );

        response.forEach((result) => {
          // Parse impacts
          //TODO: dynamics labels and backgroundColor
          let damageEndpoint = result[0].damageEndpoint.toLowerCase();

          commit("initImpact", damageEndpoint);
          commit("initDetailledImpact", damageEndpoint);

          result.forEach((scenario_result) => {
            // Add value to impact
            state.impact_on_spheres[damageEndpoint].datasets[0].data.push(scenario_result.value);
            // Add values to detailled impact
            state.impact_on_spheres_detailled[damageEndpoint].datasets[0].data.push(scenario_result.hardware)
            state.impact_on_spheres_detailled[damageEndpoint].datasets[1].data.push(scenario_result.software)
            state.impact_on_spheres_detailled[damageEndpoint].datasets[2].data.push(scenario_result.journey)
          });
          commit("APIloaded");
        });
      }
    },
  },
});

// Variable globale pour les tests
global.store = store;

export default store;
