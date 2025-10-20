import type { Ctrl } from "../routes/routes.type";

export type PinnedMessageCtrl = Ctrl & {
  messageHandler: (event: Event) => void;
}

export type PinnedCtrl = Ctrl & {
  init: () => void;
  cleanUp: () => void;
  subscribe: (message: any) => void;
}