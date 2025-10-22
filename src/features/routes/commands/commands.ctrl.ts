import actionsCtrl from "../../actions/actions.ctrl";
import overlayCtrl from "../../overlay/overlay.ctrl";
import tagFilterCtrl from "../../tag-filter/tag-filter.ctrl";
import type { Ctrl } from "../routes.type";
import { insertPanel } from "../../panels/panels.utils";
import { inputFieldsHandler } from "../../input-fields/input-fields.handler";
import linkFieldCtrl from "../../link-field/link-field.ctrl";

const commandsCtrl: Ctrl = {
  async init() {
    actionsCtrl.init?.();
    overlayCtrl.init?.();
    tagFilterCtrl.init?.();
    insertPanel('panel-commands', inputFieldsHandler);
    linkFieldCtrl.init?.();
  },
  cleanUp() {
    actionsCtrl?.cleanUp?.();
    overlayCtrl?.cleanUp?.();
    tagFilterCtrl?.cleanUp?.();
  }
}

export default commandsCtrl;