import { cook } from "@/src/utils/kitchen";
import { LINK_FIELDS } from "./link-field.const";
import type { LinkFieldCtrl } from "./link-field.type";

const linkFieldCtrl: LinkFieldCtrl = {

  init() {
    const linkField = document.getElementById('panel-commands-slot');

    if (!linkField) return

    const fragment = document.createDocumentFragment();
    for (const field of LINK_FIELDS) {
      const div = document.createElement('div');
      div.className = 'field';
      const label = document.createElement('label');
      label.textContent = field.label;
      const input = document.createElement('input');
      input.type = 'text';
      input.name = field.name;
      input.value = field.value;
      input.readOnly = true;
      div.appendChild(label);
      div.appendChild(input);
      fragment.appendChild(div);
    }

    cook('link-field', () => {
      linkField.appendChild(fragment);
    });
  },

}

export default linkFieldCtrl;