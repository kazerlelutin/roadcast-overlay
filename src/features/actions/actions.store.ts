import { createStore } from "@/src/utils/proxy-sub";
import type { Action } from "./action.types";

type ActionsStore = {
  actions: Action[];
  getActions: () => Promise<Action[]>;
}

export const actionsStore = createStore<ActionsStore>({
  actions: [],
  async getActions(): Promise<Action[]> {
    actionsStore.actions = [];
    const url = new URL('/api/actions', window.location.origin);

    let data: { name: string; content: string }[] = [];

    try {
      const actions = await fetch(url.toString());
      const actionsData = await actions.json();
      data = actionsData;
    } catch (error) {
      console.error('Error fetching actions:', error);
      return [];
    }

    data.forEach((template: { name: string; content: string, suffix?: string }) => {
      const div = document.createElement('div');
      div.innerHTML = template.content;
      const el = div.firstChild as HTMLElement;
      const description = el.getAttribute('description');
      const title = el.getAttribute('title');
      const tags = el.getAttribute('tag')?.split(',').map((tag: string) => tag.trim());
      const scripts = el.getAttribute('script')?.split(',').map((script: string) => script.trim());
      const inputs = el.getAttribute('inputs')?.split(',').map((input: string) => input.trim());
      const slot = el.getAttribute('slot');

      actionsStore.actions.push({
        id: template.name,
        name: title || '',
        description: description || '',
        tags: tags || [],
        script: scripts || [],
        html: template.content || '',
        inputs: inputs || [],
        suffix: template.suffix || '',
        slot: slot ? parseInt(slot) : 0,
      });
    })
    return actionsStore.actions
  }
}, {
  notifyOnProps: ['actions'],
});