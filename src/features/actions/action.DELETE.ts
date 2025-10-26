import type { BunRequest } from "bun";

export const actionExecuteDelete = async (req: BunRequest) => {
  const { id } = req.params as { id: string };
  const action = Bun.file(`data/custom/${id}`);
  if (await action.exists()) {
    await action.delete();
  }
  return new Response("ok", { status: 200 });
}