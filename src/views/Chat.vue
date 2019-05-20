<template>
  <div class="home">
    <DialogflowVue
      :color="color"
      :lang="lang"
      :apiKey="apiKey"
      :corsUrl="corsUrl"
      :googleAnalytics="googleAnalytics"
      :title="title"
      :heading="heading"
      :subheading="subheading"
      :send="send"
      :typing="typing"
      style="height: 100vh"
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
  googleAnalytics?: string;
  title?: string;
  heading?: string;
  subheading?: string;
  send?: string;
  typing?: string;
  private created() {
    this.color = f(this.$route.query.color);
    this.lang = f(this.$route.query.lang);
    this.corsUrl = f(this.$route.query.corsUrl);
    this.apiKey = f(this.$route.query.apiKey);
    this.googleAnalytics = f(this.$route.query.googleAnalytics);
    this.title = f(this.$route.query.title);
    this.heading = f(this.$route.query.heading);
    this.subheading = f(this.$route.query.subheading);
    this.send = f(this.$route.query.send);
    this.typing = f(this.$route.query.typing);
  }
}
</script>
