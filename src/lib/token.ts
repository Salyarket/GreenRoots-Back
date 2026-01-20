import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { config } from "../../config.js";

export function generateAuthenticationTokens(user: User) {
  const payload = {
    userId: user.id,
    role: user.role,
  };

  // générer access token
  const accessToken = jwt.sign(payload, config.server.jwtSecret, {
    expiresIn: "1h",
  });

  // générer refresh token
  const refreshToken = crypto.randomBytes(128).toString("base64");

  return {
    accessToken: {
      token: accessToken,
      type: "Bearer",
      expiresInMS: 1 * 60 * 60 * 1000, // 1h
    },
    refreshToken: {
      token: refreshToken,
      type: "Bearer",
      expiresInMS: 7 * 24 * 60 * 60 * 1000, // 7j
    },
  };
}
