import type { ChatCtrl } from "./chat.type";
import tmi from 'tmi.js';
import { cook } from '@/src/utils/kitchen';
import { websocketAPI } from "@/src/features/websocket/websocket.store";

export const chatCtrl: ChatCtrl = {
  client: null as unknown as tmi.Client,
  messages: [],
  init: () => {
    const getParams = new URLSearchParams(window.location.search);
    const channel = getParams.get('channel') || '';
    const sizeStr = getParams.get('size') || '1';
    let size = parseFloat(sizeStr);
    if (isNaN(size)) {
      size = 1;
    }

    websocketAPI.subscribe("alert", chatCtrl.subscribe);

    if (!channel) {
      const alertContainer = document.getElementById('alert-container');

      if (!alertContainer) {
        throw new Error('Alert container not found');
      }

      alertContainer.innerHTML = '<div class="chat-alert" style="font-size: ' + size + 'em;">Veuillez entrer un nom de channel dans l\'URL <br>(ex: /chat?channel=channel)</div>';
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
  updateUI: () => {
    const getParams = new URLSearchParams(window.location.search);

    const chatContainer = document.getElementById('chat');
    const sizeStr = getParams.get('size') || '1';
    let size = parseFloat(sizeStr);
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
    console.log('message', message);
    const chatContainer = document.getElementById('chat-alert');
    if (!chatContainer) {
      throw new Error('Chat alert container not found');
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