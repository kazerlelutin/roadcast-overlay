import type { Ctrl } from '../routes/routes.type';


export type ActionsCtrl = Ctrl & {
  subscribeActions?: () => void;
  subscribeTags?: () => void;
  updateUI: () => void;
  handleActionClick: (event: Event) => Promise<void> | void;
  createActionElement: (action: Action) => HTMLElement;
  getInputValue: (name: string) => string;
}

export interface ActionProp {
  name: string;
  type: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'image' | 'video' | 'youtube';
  label: string;
  default: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ActionHandler {
  id: string;
  name: string;
  type: 'start' | 'stop' | 'custom';
  required: boolean;
  icon?: string;
  description?: string;
  script: string;
}


export interface Action {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  html: string;
  slot?: number;
  suffix?: string;
  script: string[]
  inputs: string[]
}

export interface Tag {
  id?: number;
  name: string;
  color: string;
  createdAt?: string;
}

export interface HandlerContext {
  action: Action;
  overlay: HTMLElement;
  props: Record<string, any>;
}

export type HandlerFunction = (context: HandlerContext) => void | Promise<void>;

export interface CreateActionRequest {
  name: string;
  description?: string;
  templateId: string;
  props: Record<string, any>;
  tags: string[];
}

export interface UpdateActionRequest {
  id: number;
  name?: string;
  description?: string;
  props?: Record<string, any>;
  tags?: string[];
}

export interface ActionListResponse {
  actions: Action[];
  tags: Tag[];
}
