import home from "./home/home.def.ts";
import overlay from "./overlay/overlay.def.ts";
import commands from "./commands/commands.def.ts";
import chat from "./chat/chat.def.ts";
import alert from "./alert/alert.def.ts";
import type { Route } from "./routes.type";

export const routes: Map<string, Route> = new Map([
  home,
  overlay,
  commands,
  chat,
  alert
])