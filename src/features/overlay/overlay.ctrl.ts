import type { OverlayCtrl } from "./overlay.type";
import { websocketAPI } from "../websocket/websocket.store";
import { OVERLAY_CONTAINER_ID } from "./overlay.const";

const activeActionInstances = new Map<number, string[]>();

const overlayCtrl: OverlayCtrl = {
  init: () => {
    websocketAPI.subscribe("overlay", overlayCtrl.subscribe);
    overlayCtrl.setupResizeObserver();
    const clearScreenButton = document.querySelector('[data-action="clear-screen"]');
    if (clearScreenButton) {
      clearScreenButton.addEventListener('click', overlayCtrl.clearScreen);
    }
  },
  subscribe: (message) => {
    const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
    if (!overlayContainer) {
      throw new Error('Overlay container not found');
    }

    if (message.id === 'clear' && message.script === 'screen') {
      overlayContainer.innerHTML = '';
      return;
    }


    const isExists = overlayContainer.querySelector(`[data-action-id="${message.id}"]`);
    if (!isExists) {

      const div = document.createElement('div');
      div.innerHTML = message.html;
      (div.firstChild as HTMLElement)?.setAttribute('data-action-id', message.id);
      div.setAttribute('data-insert', 'true');
      const styles = div.getElementsByTagName('style') || [];
      const scripts: HTMLScriptElement[] = Array.from(div.getElementsByTagName('script')) || [];
      overlayContainer.appendChild(div.firstChild as HTMLElement);
      Array.from(styles).forEach((style: HTMLStyleElement) => overlayContainer.appendChild(style));
      Array.from(scripts).forEach((script: HTMLScriptElement) => {
        overlayContainer.appendChild(script);
        if (script.textContent) {
          try {
            eval(script.textContent);
          } catch (error) {
            console.error('Erreur lors de l\'exécution du script du template:', error);
          }
        }
      });

      overlayCtrl.adaptInsert();
    }
    globalThis?.[message.script as keyof typeof globalThis]?.();
  },

  setupResizeObserver: () => {
    const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
    if (!overlayContainer) return;
    overlayContainer.addEventListener('resize', overlayCtrl.adaptInsert);
  },

  adaptInsert: () => {

    const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
    if (!overlayContainer) {
      throw new Error('Overlay container not found');
    }
    const baseWidth = 1920
    const baseHeight = 1080

    const scaleX = overlayContainer.getBoundingClientRect().width / baseWidth;
    const scaleY = overlayContainer.getBoundingClientRect().height / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    overlayContainer.style.fontSize = (16 * scale).toFixed(2) + 'px';
  },
  clearScreen: async () => {
    await fetch(`/api/actions/execute/clear/screen`);
  },
  cleanUp: () => {
    websocketAPI.unsubscribe("overlay", overlayCtrl.subscribe);

    const overlayContainer = document.getElementById(OVERLAY_CONTAINER_ID);
    const clearScreenButton = document.querySelector('[data-action="clear-screen"]');
    if (overlayContainer) {
      overlayContainer.removeEventListener('resize', overlayCtrl.adaptInsert);
    }

    activeActionInstances.clear();
    if (clearScreenButton) {
      clearScreenButton.removeEventListener('click', overlayCtrl.clearScreen);
    }
  }
}

export default overlayCtrl;