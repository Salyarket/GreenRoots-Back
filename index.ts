import { config } from "./config.js";
import { app } from "./src/app.js";

// Démarre le serveur
const port = config.server.port;

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
