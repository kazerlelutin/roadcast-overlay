import type { Ctrl } from "../routes/routes.type";

export type AlertCtrl = Ctrl & {
  submitAlert: (event: Event) => void;
  subscribeAlert?: () => void;
  clearAlert: () => void;
}