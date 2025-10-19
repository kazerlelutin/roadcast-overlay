import type { RouteDef } from "../routes.type";
import sliderCtrl from "./overlay.ctrl";

const route: RouteDef = ['/overlay', { path: '/overlay', title: 'Overlay', templateId: 'overlay', ctrl: sliderCtrl }]

export default route