import type { RouteDef } from "../routes.type";
import commandsCtrl from "./commands.ctrl";

const route: RouteDef = ['/commands', { path: '/commands', title: 'ROADCAST COMMANDS', templateId: 'commands', ctrl: commandsCtrl }]

export default route