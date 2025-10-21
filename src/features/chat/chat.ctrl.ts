import type { ChatCtrl } from "./chat.type";
import tmi from 'tmi.js';
import { cook } from '@/src/utils/kitchen';
import { websocketAPI } from "@/src/features/websocket/websocket.store";

export const chatCtrl: ChatCtrl = {
  client: null as unknown as tmi.Client,
  messages: [],
  async init() {

    websocketAPI.subscribe("alert", chatCtrl.subscribe);

    const resChannel = await fetch(`/api/actions/input/channel-name`);
    const channel = await resChannel.text();
    const resSize = await fetch(`/api/actions/input/font-size`);
    const size = await resSize.text();

    if (!channel) {
      const alertContainer = document.getElementById('alert-container');

      if (!alertContainer) {
        throw new Error('Alert container not found');
      }

      alertContainer.innerHTML = '<div class="chat-alert" style="font-size: ' + size + 'em;">Veuillez entrer un nom de channel dans les paramètres</div>';
      return;
    }

    chatCtrl.client = new tmi.Client({
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [channel],
    });
    chatCtrl.client.connect();
    chatCtrl.client.on('message', (_channel, tags, message) => {

      chatCtrl.messages.push({
        username: tags.username || 'Anonyme',
        message: message
      });

      if (chatCtrl.messages.length > 20) {
        chatCtrl.messages.shift();
      }
      chatCtrl.updateUI();

    });
  },
  async updateUI() {
    const chatContainer = document.getElementById('chat');
    const resSize = await fetch(`/api/actions/input/font-size`);
    let size = parseFloat(await resSize.text())

    if (isNaN(size)) {
      size = 1;
    }

    if (!chatContainer) {
      throw new Error('Chat container not found');
    }
    cook('chat', () => {
      chatContainer.innerHTML = chatCtrl.messages.map(message => `<div class="message" style="font-size:${size}em;"><span class="message-username">${message.username}:</span> <span class="message-text">${message.message}</span></div>`).join('');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  },
  subscribe: (message: any) => {
    const chatContainer = document.getElementById('chat-alert');
    if (!chatContainer) {
      return
    }

    if (message.html) {
      chatContainer.classList.add('alert-pulse');
      setTimeout(() => {
        if (!chatContainer) {
          return;
        }
        chatContainer.classList.remove('alert-pulse');
      }, 3000);
    }
    chatContainer.innerHTML = message.html;

  },
  cleanUp: () => {
    chatCtrl.messages = [];
  }
}