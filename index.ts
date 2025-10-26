import { serve } from "bun";
import index from "./index.html";
import { actionExecuteGET, actionInputGET, actionsGET } from "./src/features/actions/actions.GET";
import { alertPost } from "./src/features/alert/alert.POST";
import { actionCopyPost, actionInputPost } from "./src/features/actions/action.post";
import { pinnedPost } from "./src/features/pinned-message/pinned-message.POST";
import { actionExecuteDelete } from "./src/features/actions/action.DELETE";


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
    "/api/actions/execute/copy/:id": {
      POST: actionCopyPost,
    },
    "/api/actions/execute/delete/:id": {
      DELETE: actionExecuteDelete,
    },
    "/api/actions/execute/:id/:script/:overlay": {
      GET: actionExecuteGET,
    },

    "/api/actions/execute/alert/send": {
      POST: alertPost,
    },
    "/api/actions/execute/pinned/send": {
      POST: pinnedPost,
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