<template>
  <div class="dialogflow-vue">
    <ul class="messages" ref="messages">
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
      <li class="message message--from-ai" v-if="loading">
        <span class="message-text">Typing...</span>
      </li>
    </ul>
    <form @submit.prevent="talk">
      <input type="text" v-model="text" />
      <button>Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import snarkdown from "snarkdown";
import linkifyUrls from "linkify-urls";

interface Message {
  id: string;
  text: string;
  from: string;
  date: Date;
}

@Component
export default class DialogflowVue extends Vue {
  @Prop({ default: "ee13e89f-05ab-4cda-9f09-4204311c3d80" }) "apiKey": string;
  @Prop({ default: "https://cors-anywhere.herokuapp.com" }) "corsUrl": string;
  @Prop({ default: "en" }) "lang": string;
  @Prop({ default: "darkcyan" }) "color": string;
  text = "";
  loading = false;
  messages: Message[] = [];
  mounted() {
    console.log("I am mounted!");
    this.scroll();
  }
  private md(text: string) {
    text = text.replace(/\\n/g, "\n");
    const result = linkifyUrls(text, {
      attributes: { class: "dialogflow-link" }
    });
    if (typeof result === "string") text = result;
    return snarkdown(text);
  }
  private scroll() {
    (<Element>this.$refs.messages).scrollTo(
      0,
      (<Element>this.$refs.messages).scrollHeight
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
.messages {
  margin: 0;
  padding: 1rem;
  list-style: none;
  overflow: auto;
  height: 500px;
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
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background-color: whitesmoke;
  word-break: break-word;
  border-radius: 2rem;
}
.message--from-user .message-text {
  border-bottom-right-radius: 0;
}
.message--from-ai .message-text {
  border-bottom-left-radius: 0;
}
</style>

<style>
.dialogflow-link {
  color: inherit;
  font-weight: bold;
}
</style>
