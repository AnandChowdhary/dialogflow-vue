import component from "./src/dialogflow-vue.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("DialogflowVue", component);
}

const plugin = {
  install
};

/* global window global */
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

component.install = install;

export default component;
