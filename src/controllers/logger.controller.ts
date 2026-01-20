import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "app.log");

class LoggerController {
  // GET /logs = retourne les logs si dispo
  getLogs = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!fs.existsSync(logFilePath)) {
        return res.json([]); // pas de logs = tableau vide
      }

      const content = fs.readFileSync(logFilePath, "utf-8");
      const lines = content
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
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

  // DELETE /logs = supprime le fichier s’il existe
  clearLogs = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (fs.existsSync(logFilePath)) {
        fs.unlinkSync(logFilePath); // supprime le fichier
      }
      res.json({ message: "Logs supprimés ou inexistants." });
    } catch (err) {
      next(err);
    }
  };
}

export default new LoggerController();
