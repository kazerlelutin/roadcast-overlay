import type { Ctrl } from '../routes.type';
import overlayCtrl from '../../overlay/overlay.ctrl';


const sliderCtrl: Ctrl = {
  init() {

    overlayCtrl.init?.();

  },
  cleanUp() {
    overlayCtrl?.cleanUp?.();
  }
}

export default sliderCtrl;