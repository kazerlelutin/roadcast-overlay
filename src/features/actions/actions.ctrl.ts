import type { Action, ActionsCtrl } from './action.types';
import { actionsStore } from './actions.store';
import { tagFilterStore } from '../tag-filter/tag-filter.store';
import { cook } from '@/src/utils/kitchen';
import tagFilterCtrl from '../tag-filter/tag-filter.ctrl';

const actionsCtrl: ActionsCtrl = {

  getInputValue: (name: string): string => {
    return localStorage.getItem(`input_${name}`) || '';
  },

  updateUI: () => {

    const actionsList = document.getElementById('actions-list');
    if (!actionsList) {
      throw new Error('Actions list not found');
    }

    const fragment = document.createDocumentFragment();
    actionsStore.actions
      .filter(action => tagFilterStore.selectedTags.length === 0 || tagFilterStore.selectedTags.some(tag => action.tags.includes(tag)))
      .forEach((action: Action) => {
        const actionElement = actionsCtrl.createActionElement(action);
        fragment.appendChild(actionElement);
      });


    cook('actions-list', () => {
      actionsList.replaceChildren(fragment);
    });
  },
  async init() {
    await actionsStore.getActions();

    tagFilterStore.setTags([...new Set(actionsStore.actions.flatMap(action => action.tags) || [])]);
    tagFilterCtrl.updateUI('all');

    const actionsList = document.getElementById('actions-list');
    if (!actionsList) {
      throw new Error('Actions list not found');
    }

    actionsCtrl.updateUI();
    actionsCtrl.subscribeActions = actionsStore.subscribe(() => actionsCtrl.updateUI());
    actionsList.addEventListener('click', actionsCtrl.handleActionClick);
    actionsCtrl.subscribeTags = tagFilterStore.subscribe(() => {
      actionsCtrl.updateUI();
    });

  },
  createActionElement(action: Action): HTMLElement {
    const template = document.getElementById('action-item-template') as HTMLTemplateElement;
    if (!template) return document.createElement('div');


    const clone = template.content.cloneNode(true) as DocumentFragment;
    const actionElement = clone.querySelector('.action-item') as HTMLElement;

    if (!actionElement) return document.createElement('div');
    actionElement.setAttribute('data-action-name', action.name);

    const nameElement = actionElement.querySelector('.action-name') as HTMLElement;
    const descElement = actionElement.querySelector('.action-description') as HTMLElement;
    const tagsElement = actionElement.querySelector('.action-tags') as HTMLElement;
    const inputsElement = actionElement.querySelector('.action-inputs') as HTMLElement;

    const actionControls = actionElement.querySelector('.action-controls') as HTMLElement;
    const actionsFragment = document.createDocumentFragment();


    action?.script.forEach((script: string) => {

      const button = document.createElement('button');
      button.setAttribute('data-action-id', action.id);
      button.className = 'action-custom';
      button.textContent = script?.split('_')[0] || 'Custom';
      button.setAttribute('data-action', script);
      actionsFragment.appendChild(button);
    });

    if (nameElement) nameElement.textContent = action.name;
    if (descElement) descElement.textContent = action.description || '';
    if (actionControls) actionControls.appendChild(actionsFragment);

    if (tagsElement) {

      tagsElement.replaceChildren(
        ...[...(action.tags || [])].map(tag => {
          const el = document.createElement('span');
          el.className = 'tag';
          el.textContent = String(tag);
          return el;
        })
      );
    }
    if (inputsElement) {
      inputsElement.replaceChildren(
        ...[...(action.inputs || [])].map(input => {
          const element = document.createElement('div');
          const [type, name] = input.split(':');
          const label = document.createElement('label');
          label.textContent = name?.split('_')[0]?.toUpperCase() || '';
          const inputElement = document.createElement('input');
          inputElement.setAttribute('type', type || '');
          inputElement.setAttribute('name', name || '');
          element.appendChild(label);
          element.appendChild(inputElement);
          inputElement.addEventListener('change', (event: Event) => {
            if (!name) return;
            const target = event.target as HTMLInputElement;
            const value = target.value;

            fetch(`/api/actions/input`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, value }),
            }).catch(error => {
              console.error('Erreur lors de l\'envoi:', error);
            });
          });
          return element;
        })
      );

      for (const input of action?.inputs || []) {
        const [, name] = input.split(':');
        fetch(`/api/actions/input/${name}`).then(async (value) => {
          const valueContent = await value.text();
          const element = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
          if (element) {
            element.value = valueContent;
          }
        });
      }
    }

    return actionElement;
  },

  handleActionClick: async (event: Event) => {
    const target = event.target as HTMLElement;
    const action = target.closest('.action-item') as HTMLElement;

    if (!action) return;

    const actionId = target.getAttribute('data-action-id');
    const actionType = target.getAttribute('data-action');

    const allActionControls = document.querySelectorAll(`button[data-action-id="${actionId}"]`);

    allActionControls.forEach(control => {
      control.setAttribute('data-last-clicked', 'false');
    });

    if (!actionType?.startsWith('stop')) {
      target.setAttribute('data-last-clicked', 'true');
    }

    if (!actionId || !actionType) {
      return;
    }

    try {
      await fetch(`/api/actions/execute/${actionId}/${actionType}`);

    } catch (error) {
      console.error('Erreur lors de l\'exécution:', error);
    }
  },

  cleanUp: () => {
    const actionsList = document.getElementById('actions-list');
    if (actionsList) actionsList.removeEventListener('click', actionsCtrl.handleActionClick);
    actionsCtrl.subscribeActions?.();
    actionsCtrl.subscribeTags?.();

  },
}

export default actionsCtrl;
