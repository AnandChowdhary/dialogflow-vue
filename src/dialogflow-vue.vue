<template>
  <div class="dialogflow-vue">
    <div class="title" v-if="title">{{ title }}</div>
    <div class="messages empty-state" v-if="!messages.length">
      <div>
        <h1>{{ heading }}</h1>
        <p>{{ subheading }}</p>
      </div>
    </div>
    <ul v-else class="messages" ref="messages">
      <li
        :class="`message message--from-${message.from}`"
        v-for="(message, index) in messages"
        :key="`message_${message.id}_${index}`"
      >
        <span
          class="message-text"
          v-html="md(message.text)"
          :style="
            message.from === 'user' ? `color: #fff; background: ${color}` : ''
          "
          />
      </li>
      <li class="message message--from-ai loading" v-if="loading">
        <span class="message-text">{{ typing }}</span>
      </li>
    </ul>
    <form @submit.prevent="talk">
      <input placeholder="Type something..." type="text" v-model="text" />
      <button :style="`background: ${color}; color: #fff`">{{ send }}</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import snarkdown from "snarkdown";
import linkifyUrls from "linkify-urls";
import ua from "universal-analytics";

interface Message {
  id: string;
  text: string;
  from: string;
  date: Date;
}
interface Attrs {
  [index: string]: string;
}

@Component
export default class DialogflowVue extends Vue {
  @Prop({ default: "ee13e89f-05ab-4cda-9f09-4204311c3d80" }) "apiKey": string;
  @Prop({ default: "https://cors-anywhere.herokuapp.com" }) "corsUrl": string;
  @Prop({ default: "en" }) "lang": string;
  @Prop() "googleAnalytics": string;
  @Prop({ default: "darkcyan" }) "color": string;
  @Prop({ default: "" }) "title": string;
  @Prop({ default: "Say hello!" }) "heading": string;
  @Prop({ default: "Start typing something to get answers" }) "subheading": string;
  @Prop({ default: "Send" }) "send": string;
  @Prop({ default: "• • •" }) "typing": string;
  @Prop({ default: () => {} }) "linkAttributes": Attrs;
  text = "";
  user?: ua.Visitor;
  loading = false;
  messages: Message[] = [];
  private created() {
    this.user = ua(this.googleAnalytics);
  }
  private mounted() {
    this.scroll();
    if (this.user) this.user.event("dialogflow", "open").send();
  }
  private md(text: string) {
    text = text.replace(/\\n/g, "\n");
    const result = linkifyUrls(text, {
      attributes: {
        class: "dialogflow-link",
        target: "_blank",
        ...this.linkAttributes
      }
    });
    if (typeof result === "string") text = result;
    return snarkdown(text);
  }
  private scroll() {
    const m = <Element>this.$refs.messages;
    if (m) m.scrollTo(
      0,
      m.scrollHeight
    );
  }
  private talk() {
    this.loading = true;
    this.messages.push({
      id: Math.random()
        .toString(36)
        .slice(2),
      date: new Date(),
      text: this.text,
      from: "user"
    });
    this.$nextTick(() => this.scroll());
    fetch(
      `${
        this.corsUrl
      }/https://console.dialogflow.com/api-client/demo/embedded/${
        this.apiKey
      }/demoQuery?q=${encodeURIComponent(
        this.text
      )}&sessionId=1a74ad52-9ae1-3997-c792-58530eccfcb4&lang=${this.lang}`
    )
      .then(response => response.json())
      .then(json => {
        this.messages.push({
          id: json.id,
          date: new Date(),
          text: json.result.fulfillment.speech,
          from: "ai"
        });
        this.$emit("on-response", json.result.fulfillment);
        if (this.user) this.user.event("dialogflow", "message", this.text, json.result.fulfillment.speech).send();
      })
      .catch(error => {
        this.$emit("on-error", error);
      })
      .finally(() => {
        this.loading = false;
        this.scroll();
      });
    this.text = "";
  }
}
</script>

<style scoped>
.dialogflow-vue {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.messages {
  margin: 0;
  padding: 1rem;
  list-style: none;
  overflow: auto;
  line-height: 1.5;
  flex-grow: 1;
}
.empty-state {
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
}
.loading {
  color: #aaa;
}
h1 {
  font-weight: 300;
}
.message {
  display: flex;
  text-align: left;
}
.message--from-user {
  justify-content: flex-end;
}
.message-text {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-bottom: 0.75rem;
  background-color: whitesmoke;
  word-break: break-word;
  max-width: 75%;
  border-radius: 1.25rem;
}
.message--from-user .message-text {
  border-bottom-right-radius: 0;
}
.message--from-ai .message-text {
  border-bottom-left-radius: 0;
}
form {
  background-color: whitesmoke;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
}
input {
  font: inherit;
  border: 1px solid #ddd;
  border-radius: 1.25rem;
  padding: 0.5rem 1rem;
  flex-grow: 1;
  margin-right: 0.5rem;
}
input:focus {
  outline: none;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
}
button {
  font: inherit;
  border: 0;
  border-radius: 1.25rem;
  padding: 0.5rem 1rem;
}
.title {
  background-color: whitesmoke;
  font-size: 110%;
  padding: 1rem;
  margin-bottom: 0.5rem;
}
</style>

<style>
.dialogflow-link {
  color: inherit;
  font-weight: bold;
}
</style>
