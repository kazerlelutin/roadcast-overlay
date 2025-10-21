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


