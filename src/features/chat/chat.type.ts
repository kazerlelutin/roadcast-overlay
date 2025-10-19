import type { Ctrl } from "../routes/routes.type";
import type tmi from 'tmi.js';

export type ChatCtrl = Ctrl & {
  client: tmi.Client;
  messages: { username: string, message: string }[];
  updateUI: () => void;
  subscribe: (message: any) => void;
}