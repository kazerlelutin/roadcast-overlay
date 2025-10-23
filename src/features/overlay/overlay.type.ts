import type { Ctrl } from "../routes/routes.type";

type Message = {
  type: string;
  text?: string;
  [key: string]: any;
}

export type OverlayCtrl = Ctrl & {
  init: (overlay?: string) => void;
  subscribe: (message: Message) => void;
  setupResizeObserver: () => void;
  adaptInsert: () => void;
  clearScreen: () => Promise<void>;
  choiceOverlay: (event: Event) => void;
};

export type OverlayStore = {
  overlay: string;
  setOverlay: (overlay: string) => void;
};