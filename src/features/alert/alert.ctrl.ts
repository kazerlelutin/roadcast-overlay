import { websocketAPI } from "../websocket/websocket.store";
import type { AlertCtrl } from "./alert.type";

const alertCtrl: AlertCtrl = {
  init() {

    const alertForm = document.getElementById('alert-form');
    if (alertForm) {
      alertForm.addEventListener('submit', alertCtrl.submitAlert);
    }
    const alertButtonClear = document.getElementById('alert-button-clear');
    if (alertButtonClear) {
      alertButtonClear.addEventListener('click', alertCtrl.clearAlert);
    }
  },
  submitAlert: (event: Event) => {
    event.preventDefault();
    const message = document.getElementById('alert-textarea') as HTMLTextAreaElement;
    fetch(`/api/actions/execute/alert/send`, {
      method: 'POST',
      body: JSON.stringify({ message: message.value }),
    });
  },
  clearAlert: () => {
    fetch(`/api/actions/execute/alert/send`, {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
    });
  },
  cleanUp() {
    const alertForm = document.getElementById('alert-form');
    if (alertForm) {
      alertForm.removeEventListener('submit', alertCtrl.submitAlert);
    }
    const alertButtonClear = document.getElementById('alert-button-clear');
    if (alertButtonClear) {
      alertButtonClear.removeEventListener('click', alertCtrl.clearAlert);
    }
  }
}

export default alertCtrl;