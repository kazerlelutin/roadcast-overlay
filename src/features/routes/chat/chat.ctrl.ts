import type { Ctrl } from '@features/routes/routes.type';
import { chatCtrl } from '../../chat/chat.ctrl';


const chatPage: Ctrl = {
  async init() {
    chatCtrl.init?.();
  },
  cleanUp() {
    chatCtrl?.cleanUp?.();

  }
}

export default chatPage;
