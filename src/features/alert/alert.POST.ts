import { server } from "@/index";

export const alertPost = async (req: Request) => {
  const data = await req.json();

  server.publish("alert", JSON.stringify({
    type: 'action',
    room: 'alert',
    data: { html: data.message }
  }));
  return new Response("ok", { status: 200 });
}

