import type { PinnedMessageCtrl } from "./pinned-message.type";

const pinnedMessageCtrl: PinnedMessageCtrl = {
  init() {
    const chatContainer = document.getElementById('chat');
    if (!chatContainer) return;
    chatContainer.addEventListener('click', pinnedMessageCtrl.messageHandler);
  },

  messageHandler(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const messageDiv = target.closest('.message');
    if (messageDiv) {
      fetch(`/api/actions/execute/pinned/send`, {
        method: 'POST',
        body: JSON.stringify({ html: messageDiv.innerHTML }),
      });
    }
  },
  cleanUp() {
    const chatContainer = document.getElementById('chat');
    if (chatContainer) {
      chatContainer.removeEventListener('click', pinnedMessageCtrl.messageHandler);
    }
  }

}

export default pinnedMessageCtrl;