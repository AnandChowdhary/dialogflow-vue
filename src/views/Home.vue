<template>
  <div class="home">
    <DialogflowVue msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import DialogflowVue from "../../../dist/dialogflow-vue.esm";

@Component({
  components: {
    DialogflowVue
  }
})
export default class Home extends Vue {}
</script>
