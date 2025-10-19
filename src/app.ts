import { router } from "@features/router/router";
import { translateStore } from "./features/translate/translate.store";
import { getLanguageFromLS } from "./features/translate/translate.utils";
import websocketCtrl from "./features/websocket/websocket.ctrl";

addEventListener("DOMContentLoaded", () => {
  router.init();
  translateStore.setCurrentLanguage(getLanguageFromLS());
  websocketCtrl?.init?.();
});
