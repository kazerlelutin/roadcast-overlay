import { server } from "@/index";

export const actionInputPost = async (req: Request) => {
  const data = await req.json();
  const { name, value } = data;

  const savedInput = Bun.file(`data/inputs/${name}.txt`);
  await savedInput.write(value);

  server.publish("input", JSON.stringify({
    type: 'action',
    room: name,
    data: { value }
  }));
  return new Response("ok", { status: 200 });
}

export const actionCopyPost = async (req: Request) => {
  const data = await req.json();
  const { actionId } = data;
  const action = Bun.file(`data/templates/${actionId}`);

  if (await action.exists()) {
    let counter = 1;
    let newFileName = `${actionId}+${counter}.html`;

    while (await Bun.file(`data/custom/${newFileName}`).exists()) {
      newFileName = `${actionId}+${counter}.html`;
      counter++;
    }

    await Bun.file(`data/custom/${newFileName}`).write(await action.text());
  }

  return new Response("ok", { status: 200 });
}
