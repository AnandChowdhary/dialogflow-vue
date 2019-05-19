<template>
  <div class="home">
    <DialogflowVue
      :color="color"
      :lang="lang"
      :apiKey="apiKey"
      :corsUrl="corsUrl"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import DialogflowVue from "../dialogflow-vue.vue";

const f = (item: string | (string | null)[]) =>
  (typeof item === "string"
    ? item
    : item && item.length
    ? item[0]
    : undefined) || undefined;

@Component({
  components: {
    DialogflowVue
  }
})
export default class Chat extends Vue {
  color?: string;
  lang?: string;
  corsUrl?: string;
  apiKey?: string;
  private created() {
    this.color = f(this.$route.query.color);
    this.lang = f(this.$route.query.lang);
    this.corsUrl = f(this.$route.query.corsUrl);
    this.apiKey = f(this.$route.params.apiKey);
  }
}
</script>
