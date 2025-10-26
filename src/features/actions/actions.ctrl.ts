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
    actionElement.setAttribute('data-action-suffix', action.suffix || '');

    const nameElement = actionElement.querySelector('.action-name') as HTMLElement;
    const descElement = actionElement.querySelector('.action-description') as HTMLElement;
    const tagsElement = actionElement.querySelector('.action-tags') as HTMLElement;
    const inputsElement = actionElement.querySelector('.action-inputs') as HTMLElement;
    const overlayElement = actionElement.querySelector('.command-overlay') as HTMLElement;

    const actionControls = actionElement.querySelector('.action-controls') as HTMLElement;
    const actionsFragment = document.createDocumentFragment();

    const scripts = []


    if (action.slot) {
      const slotElement = document.createElement('div');
      slotElement.className = 'action-slot-container';
      const label = document.createElement('label');
      label.textContent = 'Slot';
      label.className = 'action-slot-label';
      label.setAttribute('for', 'slot' + action.id);
      slotElement.appendChild(label);
      const input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.setAttribute('name', 'slot');
      input.setAttribute('value', "1");
      input.setAttribute('min', '1')
      input.setAttribute('max', action.slot.toString());
      input.setAttribute('step', '1')
      input.setAttribute('id', 'slot' + action.id);
      input.className = 'action-slot';

      const slotName = action.id.replace(/\.html/g, '') + '_slot';
      fetch(`/api/actions/input/${slotName}`).then(async (res) => {
        const slot = await res.text();
        input.value = slot;
      });
      input.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        fetch(`/api/actions/input`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: slotName, value }),
        });
      });

      slotElement.appendChild(input);
      actionsFragment.appendChild(slotElement);
    }

    scripts.push(...action?.script)

    if (action.suffix) {
      scripts.push(`🗑️_${action.suffix}`);
    } else {
      scripts.push(`📋_${action.suffix}`);
    }
    scripts.forEach((script: string) => {

      const button = document.createElement('button');
      button.setAttribute('data-action-id', action.id);
      button.setAttribute('data-action-id-param', 'testg');
      button.className = 'action-custom';
      if (script.startsWith('🗑️')) {
        button.setAttribute('data-trash', 'true');
      }
      if (script.startsWith('📋')) {
        button.setAttribute('data-copy', 'true');
      }
      button.textContent = script?.split('_')[0] || 'Custom';
      button.setAttribute('type', 'button');
      button.setAttribute('data-action', script);
      button.setAttribute('data-prefix', action.suffix || '');
      actionsFragment.appendChild(button);
    });

    if (nameElement) nameElement.textContent = action.suffix ? action.name + ' ' + action.suffix : action.name;
    if (descElement) descElement.textContent = action.description || '';
    if (actionControls) actionControls.appendChild(actionsFragment);

    if (overlayElement) {
      overlayElement.setAttribute('data-action-id', action.id);

      const inputsElement = overlayElement.querySelectorAll('input')
      inputsElement.forEach(element => {
        const id = element.id;
        element.id = id + '-' + action.id;
      });
      const labelsElement = overlayElement.querySelectorAll('label')
      labelsElement.forEach(element => {
        const id = element.htmlFor;
        element.htmlFor = id + '-' + action.id;
      });
    }

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
          const nameWithSuffix = name + (action.suffix ? '_' + action.suffix : '');
          const label = document.createElement('label');

          label.textContent = name?.split('_')[0]?.toUpperCase() || '' + ' ';

          const inputElement = document.createElement('input');

          inputElement.setAttribute('type', type || '');
          inputElement.setAttribute('name', nameWithSuffix || '');
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
              body: JSON.stringify({ name: nameWithSuffix, value }),
            }).catch(error => {
              console.error('Erreur lors de l\'envoi:', error);
            });
          });
          return element;
        })
      );

      for (const input of action?.inputs || []) {
        const [, name] = input.split(':');
        const nameWithSuffix = name + (action.suffix ? '_' + action.suffix : '');
        fetch(`/api/actions/input/${nameWithSuffix}`).then(async (value) => {
          const valueContent = await value.text();

          const element = document.querySelector(`input[name="${nameWithSuffix}"]`) as HTMLInputElement;

          if (element) {
            element.value = valueContent;
          }
        });
      }
    }

    return actionElement;
  },

  handleActionClick: async (event: Event) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const action = target.closest('.action-item') as HTMLElement;

    let overlay = 'default';
    if (!action) return;

    const actionId = target.getAttribute('data-action-id');
    const actionType = target.getAttribute('data-action');
    const actionTrash = target.getAttribute('data-trash');
    const actionCopy = target.getAttribute('data-copy');
    const suffix = target.getAttribute('data-prefix');

    if (actionTrash) {

      await fetch(`/api/actions/execute/delete/${actionId}`, {
        method: 'DELETE',
      });
      await actionsStore.getActions();
      actionsCtrl.updateUI();
      return;
    }
    if (actionCopy) {
      await fetch(`/api/actions/execute/copy/${actionId}`, {
        method: 'POST',
        body: JSON.stringify({ actionId }),
      });
      await actionsStore.getActions();
      actionsCtrl.updateUI();
    }


    const formOverlay = document.querySelector('form[data-action-id="' + actionId + '"]') as HTMLFormElement;
    if (!formOverlay) return;

    if (formOverlay) {
      const formData = new FormData(formOverlay);
      overlay = formData.get('overlay') as string;
    }

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
      await fetch(`/api/actions/execute/${actionId}/${actionType}+${suffix}/${overlay} `);
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
