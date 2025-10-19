import type { Ctrl } from '@features/routes/routes.type';
import alertCtrl from '@features/alert/alert.ctrl';

const alertCtrlRoute: Ctrl = {
  async init() {
    alertCtrl.init?.();
  },
  cleanUp() {
    alertCtrl?.cleanUp?.();

  }
}

export default alertCtrlRoute;
