import { cook } from "@/src/utils/kitchen";
import { TAG_ITEM_ID, TAG_SELECT_ID } from "./tag-filter.const";
import type { TagFilterCtrl } from "./tag-filter.type";
import { tagFilterStore } from "./tag-filter.store";

const tagFilterCtrl: TagFilterCtrl = {

  updateUI: (scope?: 'tags' | 'selectedTags' | 'all') => {

    if (scope === 'selectedTags' || scope === 'all') {
      const tags = tagFilterStore.tags;
      const tagSelect = document.getElementById(TAG_SELECT_ID);
      if (!tagSelect) {
        throw new Error('Tag select not found');
      }

      const fragment = document.createDocumentFragment();
      tags.filter(tag => !tagFilterStore.selectedTags.includes(tag)).sort((a, b) => a.localeCompare(b)).forEach(tag => {
        const tagItem = document.createElement('option');
        tagItem.value = tag;
        tagItem.innerHTML = tag;
        fragment.appendChild(tagItem);
      });

      const allOption = document.createElement('option');
      allOption.value = 'clear';
      allOption.innerHTML = 'EFFACER';

      const blankOption = document.createElement('option');
      blankOption.value = '';
      blankOption.innerHTML = 'Sélectionner un tag';
      blankOption.selected = true;

      cook(TAG_SELECT_ID, () => {
        tagSelect.replaceChildren(blankOption, allOption, fragment);
      })
    }


    if (scope === 'selectedTags' || scope === 'all') {
      const tagItemEl = document.getElementById(TAG_ITEM_ID);


      if (!tagItemEl) {
        throw new Error('Tag select not found');
      }

      const fragment = document.createDocumentFragment();
      for (const t of tagFilterStore.selectedTags) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.setAttribute('data-tag-id', String(t));

        chip.setAttribute('data-ui', 'tag-filter');
        const label = document.createElement('span');
        label.className = 'chip-label';
        label.textContent = t;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip-remove';
        btn.setAttribute('data-action', 'remove-tag');
        btn.setAttribute('data-id', String(t));
        btn.setAttribute('aria-label', `Supprimer ${t}`);
        btn.textContent = '×';

        chip.appendChild(label);
        chip.appendChild(btn);
        fragment.appendChild(chip);
      }
      cook(TAG_ITEM_ID, () => {
        tagItemEl.replaceChildren(fragment);
      });
    }
  },
  selectTag: (event: Event) => {
    const value = (event?.target as HTMLSelectElement)?.value;
    if (value === 'clear') {
      tagFilterStore.selectedTags = [];
    } else {
      const selectedTag = tagFilterStore.tags.find(tag => tag === value);

      if (selectedTag) {
        const oldSelectedTags = [...tagFilterStore.selectedTags || []];
        tagFilterStore.selectedTags = [...oldSelectedTags, selectedTag];
      }
    }
  },
  onChipClick(e: Event) {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-action="remove-tag"]') as HTMLElement | null;
    if (!btn) return;
    const idAttr = btn.getAttribute('data-id');
    if (!idAttr) return;
    tagFilterStore.selectedTags = (tagFilterStore.selectedTags || []).filter(t => t !== idAttr);
  },
  async init() {

    tagFilterCtrl.subscribe = tagFilterStore.subscribe((update) => {
      tagFilterCtrl.updateUI(update.prop);
    });

    const tagSelect: HTMLSelectElement | null = document.getElementById(TAG_SELECT_ID) as HTMLSelectElement;
    if (!tagSelect) {
      throw new Error('Tag select not found');
    }

    tagSelect.addEventListener('change', tagFilterCtrl.selectTag);

    const tagItemEl = document.getElementById(TAG_ITEM_ID);
    if (!tagItemEl) {
      throw new Error('Tag select not found');
    }
    tagItemEl.addEventListener('click', tagFilterCtrl.onChipClick);
  },
  cleanUp: () => {
    tagFilterStore.tags = [];
    const tagSelect: HTMLSelectElement | null = document.getElementById(TAG_SELECT_ID) as HTMLSelectElement;
    if (!tagSelect) {
      throw new Error('Tag select not found');
    }

    tagSelect.removeEventListener('change', tagFilterCtrl.selectTag);
    const tagItemEl = document.getElementById(TAG_ITEM_ID);

    if (tagItemEl) {
      tagItemEl.removeEventListener('click', tagFilterCtrl.onChipClick);
    }

    tagFilterCtrl.subscribe?.();
  }
}

export default tagFilterCtrl;