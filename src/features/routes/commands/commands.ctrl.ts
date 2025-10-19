import actionsCtrl from "../../actions/actions.ctrl";
import overlayCtrl from "../../overlay/overlay.ctrl";
import tagFilterCtrl from "../../tag-filter/tag-filter.ctrl";
import type { Ctrl } from "../routes.type";

const commandsCtrl: Ctrl = {
  async init() {
    actionsCtrl.init?.();
    overlayCtrl.init?.();
    tagFilterCtrl.init?.();
  },
  cleanUp() {
    actionsCtrl?.cleanUp?.();
    overlayCtrl?.cleanUp?.();
    tagFilterCtrl?.cleanUp?.();
  }
}

export default commandsCtrl;