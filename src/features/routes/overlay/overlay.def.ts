import type { RouteDef } from "../routes.type";
import { alphaOverlayCtrl, tangoOverlayCtrl, charlieOverlayCtrl } from "./overlay.ctrl";

export const alphaRoute: RouteDef = ['/alpha', { path: '/alpha', title: 'Overlay', templateId: 'overlay', ctrl: alphaOverlayCtrl }]

export const tangoRoute: RouteDef = ['/tango', { path: '/tango', title: 'Overlay', templateId: 'overlay', ctrl: tangoOverlayCtrl }]

export const charlieRoute: RouteDef = ['/charlie', { path: '/charlie', title: 'Overlay', templateId: 'overlay', ctrl: charlieOverlayCtrl }]