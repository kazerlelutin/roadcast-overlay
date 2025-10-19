import type { Ctrl } from '@features/routes/routes.type';
import overlayCtrl from '@features/overlay/overlay.ctrl';
import actionsCtrl from '@features/actions/actions.ctrl';
import tagFilterCtrl from '@features/tag-filter/tag-filter.ctrl';


const homeCtrl: Ctrl = {
  async init() {
    actionsCtrl.init?.();
    tagFilterCtrl.init?.();
    overlayCtrl.init?.();
  },
  cleanUp() {
    actionsCtrl?.cleanUp?.();
    tagFilterCtrl?.cleanUp?.();
    overlayCtrl?.cleanUp?.();
  }
}

export default homeCtrl;
