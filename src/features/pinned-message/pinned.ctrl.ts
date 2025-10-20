import { websocketAPI } from "../websocket/websocket.store";
import type { PinnedCtrl } from "./pinned-message.type";

const pinnedCtrl: PinnedCtrl = {
  init() {
    websocketAPI.subscribe("pinned", pinnedCtrl.subscribe);
  },
  subscribe(message: { html: string }) {
    const pinnedContainer = document.getElementById('pinned-container');

    if (!pinnedContainer) return

    pinnedContainer.classList.add('alert-pulse');
    pinnedContainer.innerHTML = message.html;

    setTimeout(() => {
      if (!pinnedContainer) {
        return;
      }
      pinnedContainer!.classList.remove('alert-pulse');
    }, 3000);

  },
  cleanUp() {
    websocketAPI.unsubscribe("pinned", pinnedCtrl.subscribe);
  }
}

export default pinnedCtrl;