import { config } from "./config.js";
import { app } from "./src/app.js";

// Démarre un serveur
const port = config.server.port;

app.use("/", (req, res) => {
  res.send("Hello  aaa aaaaaa");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
