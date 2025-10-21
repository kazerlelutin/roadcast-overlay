import { cook } from "@/src/utils/kitchen";
import { getTemplate } from "../router/router.template";

function handleExpandClick(event: Event) {
  const panelBtn = event.target as HTMLElement;
  const panelId = panelBtn.getAttribute('data-panel');
  const panel = document.querySelector(`[data-role="panel"][data-panel="${panelId}"]`);
  if (!panel) return;
  const isExpanded = panelBtn.getAttribute('data-expanded') === 'true';
  panelBtn.setAttribute('data-expanded', isExpanded ? 'false' : 'true');
  panel.setAttribute('data-expanded', isExpanded ? 'false' : 'true');
}

export function insertPanel(id: string, handler?: (element: HTMLElement) => void) {

  const panelCommands = document.getElementById(`${id}-slot`);
  if (panelCommands) {
    const template = getTemplate(id);
    const content = template.content.cloneNode(true);
    cook(`${id}-slot`, () => {
      panelCommands.replaceChildren(content);
      const btn = document.querySelector(`[data-role="panel-btn"][data-panel="${id}"]`);
      if (btn) {
        btn.addEventListener('click', handleExpandClick);
      }
      handler?.(panelCommands);
    });
  }
}