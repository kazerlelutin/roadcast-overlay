import type { Ctrl } from "../routes/routes.type";

export type ActionsCtrl = Ctrl & {
  sendAction: (event: Event) => Promise<void>;
};

export type ActionCreateCtrl = Ctrl & {
  createAction: (templateId: string) => Promise<void>;
  onSelect: (event: Event) => void;
}

export type Action = {
  action: string;
  type: string;
  content: {
    [key: string]: string;
  }
}