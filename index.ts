import { serve } from "bun";
import index from "./index.html";
import { actionExecuteGET, actionInputGET, actionsGET } from "./src/features/actions/actions.GET";
import { alertPost } from "./src/features/alert/alert.POST";
import { actionInputPost } from "./src/features/actions/action.post";


export const server = serve({
  websocket: {
    message: (ws, message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "subscribe") {
          ws.subscribe(parsedMessage.room);
        }
      } catch (error) {
        console.log('websocket message', error);
      }
    },
  },

  routes: {

    "/api/actions": {
      GET: actionsGET,
    },
    "/api/actions/input": {
      POST: actionInputPost,
    },
    "/api/actions/input/:name": {
      GET: actionInputGET,
    },
    "/api/actions/execute/:id/:script": {
      GET: actionExecuteGET,
    },
    "/api/actions/execute/alert/send": {
      POST: alertPost,
    },
    "/*": index,
  },

  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/" && req.headers.get("upgrade") === "websocket") {
      const success = server.upgrade(req);
      if (success) {
        return undefined;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    return new Response("Not Found", { status: 404 });
  },
  development: true,
});

console.log(`Listening on ${server.url}`);