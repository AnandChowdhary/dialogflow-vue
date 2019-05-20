<template>
  <div class="home">
    <h1>Generate your Dialogflow URL</h1>
    <form>
      <label>
        <span>API key</span>
        <input v-model="apiKey" type="text" placeholder="Enter your Dialogflow API key">
      </label>
      <label>
        <span>Cors Proxy URL</span>
        <input v-model="corsUrl" type="text" placeholder="Enter a URL to your CORS proxy">
      </label>
      <label>
        <span>Language</span>
        <input v-model="lang" type="text" placeholder="Select a language">
      </label>
      <label>
        <span>Google Analytics Code</span>
        <input v-model="googleAnalytics" type="text" placeholder="Enter your GA tracking code">
      </label>
      <label>
        <span>Theme color</span>
        <input v-model="color" type="text" placeholder="Select your theme color">
      </label>
      <label>
        <span>Title</span>
        <input v-model="title" type="text" placeholder="Enter the title for your chatbot">
      </label>
      <label>
        <span>Heading</span>
        <input v-model="heading" type="text" placeholder="Enter a heading for the empty state">
      </label>
      <label>
        <span>Subheading</span>
        <input v-model="subheading" type="text" placeholder="Enter a subheading for the empty state">
      </label>
      <label>
        <span>"Send" button text</span>
        <input v-model="send" type="text" placeholder="Enter text for the Send button">
      </label>
    </form>
    <h2>Your code</h2>
    <p>You can copy and paste this code to your site to show the Dialogflow chatbot.</p>
    <h3>Iframe</h3>
    <pre><code>&lt;iframe title="Chatbot" src="{{link}}"&gt;&lt;/iframe&gt;</code></pre>
    <h3>Link</h3>
    <pre><a :href="link"><code>{{link}}</code></a></pre>
    <h3>Demo</h3>
    <iframe :src="link"></iframe>
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
export default class Home extends Vue {
  url = location.href;
  apiKey = "";
  corsUrl = "https://cors-anywhere.herokuapp.com";
  lang = "en";
  googleAnalytics = "";
  color = "#4834d4";
  title = "My Chatbot";
  heading = "Say hello!";
  subheading = "Start typing something to get answers";
  send = "Send";

  private e(c: string) {
    return encodeURIComponent(c);
  }

  get link() {
    return `${this.url}embed?apiKey=${this.e(this.apiKey)}&corsUrl=${this.e(this.corsUrl)}&lang=${this.e(this.lang)}&googleAnalytics=${this.e(this.googleAnalytics)}&color=${this.e(this.color)}&title=${this.e(this.title)}&heading=${this.e(this.heading)}&subheading=${this.e(this.subheading)}&send=${this.e(this.send)}`;
  }
}
</script>

<style scoped>
.home {
  margin: 5vh 0;
}
h1 {
  font-weight: 300;
}
label {
  display: block;
  margin-bottom: 1rem;
}
label span {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
label input {
  font: inherit;
  padding: 0.75rem 1rem;
  width: 100%;
  border-radius: 0.2rem;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
pre {
  background-color: whitesmoke;
  padding: 1rem;
  border-radius: 0.2rem;
  overflow-x: auto;
}
a {
  color: darkslateblue;
}
iframe {
  width: 300px;
  height: 400px;
  border: 0;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  overflow: hidden;
}
</style>
