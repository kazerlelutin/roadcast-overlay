export const actionInputPost = async (req: Request) => {
  const data = await req.json();
  const { name, value } = data;
  const savedInput = Bun.file(`data/inputs/${name}.txt`);
  await savedInput.write(value);
  return new Response("ok", { status: 200 });
}


