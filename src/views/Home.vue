<template>
  <div class="home">
    <DialogflowVue
      style="max-width: 400px; margin: auto; box-shadow: 0 0 1rem #eee"
      msg="Welcome to Your Vue.js + TypeScript App"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import DialogflowVue from "../dialogflow-vue.vue";

@Component({
  components: {
    DialogflowVue
  }
})
export default class Home extends Vue {}
</script>
