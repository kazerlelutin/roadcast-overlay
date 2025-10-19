// Exemple d'utilisation du système de rooms WebSocket
import { websocketAPI } from "./websocket.store";

// Exemple 1: Contrôleur de chat
export const chatCtrl = {
  init: () => {
    // S'abonner à la room "chat"
    websocketAPI.subscribe("chat", (data) => {
      console.log("💬 Message reçu dans le chat:", data);
      // Afficher le message dans l'interface
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.innerHTML += `<div class="message">${data}</div>`;
      }
    });

    // Envoyer un message au chat
    const sendButton = document.getElementById('send-chat');
    sendButton?.addEventListener('click', () => {
      const input = document.getElementById('chat-input') as HTMLInputElement;
      if (input?.value) {
        websocketAPI.sendToRoom("chat", input.value);
        input.value = '';
      }
    });
  },

  cleanUp: () => {
    // Se désabonner de la room "chat"
    websocketAPI.unsubscribe("chat", (data) => {
      console.log("💬 Message reçu dans le chat:", data);
    });
  }
};

// Exemple 2: Contrôleur de notifications
export const notificationsCtrl = {
  init: () => {
    // S'abonner à la room "notifications"
    websocketAPI.subscribe("notifications", (data) => {
      console.log("🔔 Notification reçue:", data);
      // Afficher une notification toast
      showNotification(data.message, data.type);
    });
  },

  cleanUp: () => {
    // Se désabonner de la room "notifications"
    websocketAPI.unsubscribe("notifications", (data) => {
      console.log("🔔 Notification reçue:", data);
    });
  }
};

// Exemple 3: Contrôleur de jeu en temps réel
export const gameCtrl = {
  init: () => {
    const gameId = "game_123";

    // S'abonner à la room du jeu
    websocketAPI.subscribe(gameId, (data) => {
      console.log("🎮 Mise à jour du jeu:", data);
      // Mettre à jour l'état du jeu
      updateGameState(data);
    });

    // Envoyer une action de jeu
    const actionButton = document.getElementById('game-action');
    actionButton?.addEventListener('click', () => {
      websocketAPI.sendToRoom(gameId, {
        type: 'player_action',
        action: 'move',
        direction: 'up'
      });
    });
  },

  cleanUp: () => {
    const gameId = "game_123";
    websocketAPI.unsubscribe(gameId, (data) => {
      console.log("🎮 Mise à jour du jeu:", data);
    });
  }
};

// Fonctions utilitaires
function showNotification(message: string, type: string) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function updateGameState(data: any) {
  // Logique pour mettre à jour l'état du jeu
  console.log("Mise à jour de l'état du jeu:", data);
}
