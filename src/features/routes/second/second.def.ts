import type { RouteDef } from "../routes.type";
import SecondCtrl from "./second.ctrl";

const route: RouteDef = ['/second', { path: '/second', title: 'Overlay', templateId: 'overlay', ctrl: SecondCtrl }]

export default route