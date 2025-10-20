import type { Ctrl } from '@features/routes/routes.type';
import alertCtrl from '@features/alert/alert.ctrl';
import { chatCtrl } from '@features/chat/chat.ctrl';
import pinnedMessageCtrl from '@features/pinned-message/pinned-message.ctrl';
import pinnedCtrl from '@features/pinned-message/pinned.ctrl';

const alertCtrlRoute: Ctrl = {
  async init() {
    alertCtrl.init?.();
    chatCtrl.init?.();
    pinnedMessageCtrl.init?.();
    pinnedCtrl.init?.();
  },
  cleanUp() {
    alertCtrl?.cleanUp?.();
    chatCtrl?.cleanUp?.();
    pinnedMessageCtrl?.cleanUp?.();
    pinnedCtrl?.cleanUp?.();
  }
}

export default alertCtrlRoute;
