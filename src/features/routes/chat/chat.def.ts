import type { RouteDef } from "../routes.type";
import chatCtrl from "./chat.ctrl";

const route: RouteDef = ['/chat', { path: '/chat', title: 'ROADCAST LAYOUT - CHAT', templateId: 'chat', ctrl: chatCtrl }]

export default route