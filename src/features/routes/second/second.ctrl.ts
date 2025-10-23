import type { Ctrl } from '../routes.type';
import overlayCtrl from '../../overlay/overlay.ctrl';


const SecondCtrl: Ctrl = {
  init() {

    overlayCtrl.init?.('second');

  },
  cleanUp() {
    overlayCtrl?.cleanUp?.();
  }
}

export default SecondCtrl;