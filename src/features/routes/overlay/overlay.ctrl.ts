import type { Ctrl } from '../routes.type';
import overlayCtrl from '../../overlay/overlay.ctrl';

export const alphaOverlayCtrl: Ctrl = {
  init() {
    overlayCtrl.init?.('alpha');
  },
  cleanUp() {
    overlayCtrl?.cleanUp?.();
  }
}

export const tangoOverlayCtrl: Ctrl = {
  init() {
    overlayCtrl.init?.('tango');
  },
  cleanUp() {
    overlayCtrl?.cleanUp?.();
  }
}

export const charlieOverlayCtrl: Ctrl = {
  init() {
    overlayCtrl.init?.('charlie');
  },
  cleanUp() {
    overlayCtrl?.cleanUp?.();
  }
}