import morgan from "morgan";
import { logger } from "../lib/log.js";

// Morgan intercepte les informations des requêtes HTTP : je vais les transmettre à mon logger

export const loggerMiddleware = morgan(
  // Tokens est un objet contenant les informations générées par Morgan
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status_code: Number.parseFloat(tokens.status(req, res) || "0"),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseInt(tokens["response-time"](req, res) || "0"),
      user_agent: tokens["user-agent"](req, res),
      ip: "ip" in req ? req.ip : req.socket.remoteAddress,
      userId: (req as any).userId,
      userRole: (req as any).userRole,
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        //logger.http(`incoming-request`, data); => la DB va refuser http
        logger.info("incoming-request", data);
      },
    },
  }
);
