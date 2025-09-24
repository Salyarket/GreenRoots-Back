import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Ex : lecture depuis un fichier de logs
const logFilePath = path.join(process.cwd(), "logs/app.log");

class LoggerController {
  // GET /logs = retourne les logs en JSON
  getLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!fs.existsSync(logFilePath)) {
        return res.status(200).json({ message: "Aucun log disponible." });
      }

      const content = fs.readFileSync(logFilePath, "utf-8");
      // chaque ligne est un log JSON (logger.info écrit souvent en JSON.stringify)
      const lines = content.trim().split("\n").map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return { raw: line };
        }
      });

      res.json(lines);
    } catch (err) {
      next(err);
    }
  };

  // DELETE /logs = vide le fichier de logs
  clearLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      fs.writeFileSync(logFilePath, "");
      res.json({ message: "Logs supprimés." });
    } catch (err) {
      next(err);
    }
  };
}

export default new LoggerController();
