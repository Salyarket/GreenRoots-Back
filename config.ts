export const config = {
  server: {
    port: parseInt(process.env.PORT || "4444"),
    allowedOrigins: (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    cookieDomain: process.env.COOKIE_DOMAIN,
    jwtSecret: process.env.JWT_SECRET || "jwt-secret",
    secure: process.env.NODE_ENV === "production",
    logLevel: process.env.LOG_LEVEL || "info",
  },
};
