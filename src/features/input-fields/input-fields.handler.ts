export async function inputFieldsHandler(element: HTMLElement) {
  const inputs = element.querySelectorAll('input');
  for (const input of inputs) {

    const res = await fetch(`/api/actions/input/${input.name}`);
    const value = await res.text();
    input.value = value;
    input.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const name = target.name;
      const value = target.value;
      fetch(`/api/actions/input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, value }),
      });
    });
  }
}