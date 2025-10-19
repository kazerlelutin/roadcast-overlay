import type { Ctrl } from "../routes/routes.type";

type Message = {
  type: string;
  text?: string;
  [key: string]: any;
}

export type OverlayCtrl = Ctrl & {
  subscribe: (message: Message) => void;
  setupResizeObserver: () => void;
  adaptInsert: () => void;
  clearScreen: () => Promise<void>;
};