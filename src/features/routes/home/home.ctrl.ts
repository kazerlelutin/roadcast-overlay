import type { Ctrl } from '@features/routes/routes.type';
import overlayCtrl from '@features/overlay/overlay.ctrl';
import actionsCtrl from '@features/actions/actions.ctrl';
import tagFilterCtrl from '@features/tag-filter/tag-filter.ctrl';
import { insertPanel } from '../../panels/panels.utils';
import { inputFieldsHandler } from '../../input-fields/input-fields.handler';
import linkFieldCtrl from '../../link-field/link-field.ctrl';


const homeCtrl: Ctrl = {
  async init() {
    actionsCtrl.init?.();
    tagFilterCtrl.init?.();
    overlayCtrl.init?.();
    insertPanel('panel-commands', inputFieldsHandler);
    linkFieldCtrl.init?.();

  },
  cleanUp() {
    actionsCtrl?.cleanUp?.();
    tagFilterCtrl?.cleanUp?.();
    overlayCtrl?.cleanUp?.();
  }
}

export default homeCtrl;
