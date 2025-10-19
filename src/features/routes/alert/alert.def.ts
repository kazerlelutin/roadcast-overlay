import type { RouteDef } from "../routes.type";
import alertCtrl from "./alert.ctrl";

const route: RouteDef = ['/alert', { path: '/alert', title: 'ROADCAST LAYOUT - ALERT', templateId: 'alert', ctrl: alertCtrl }]

export default route