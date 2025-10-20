import type { Ctrl } from '@features/routes/routes.type';
import { chatCtrl } from '../../chat/chat.ctrl';
import pinnedCtrl from '../../pinned-message/pinned.ctrl';


const chatPage: Ctrl = {
  async init() {
    chatCtrl.init?.();
    pinnedCtrl.init?.();
  },
  cleanUp() {
    chatCtrl?.cleanUp?.();
    pinnedCtrl?.cleanUp?.();

  }
}

export default chatPage;
