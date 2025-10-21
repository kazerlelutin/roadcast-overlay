import { server } from "@/index";

export const pinnedPost = async (req: Request) => {
  const data = await req.json();

  server.publish("pinned", JSON.stringify({
    type: 'action',
    room: 'pinned',
    data: { html: data.html }
  }));
  return new Response("ok", { status: 200 });
}