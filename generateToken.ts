import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans le .env");
}

// Récupère les arguments passés en ligne de commande
// Exemple : npx tsx generateToken.ts 1 admin OU npx tsx generateToken.ts 2 member
const userId = parseInt(process.argv[2] || "1", 10);
const role = process.argv[3] || "admin"; // admin par défaut

const token = jwt.sign(
  { userId, role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

console.log(`Generated token for userId=${userId}, role=${role}:\n`);
console.log(token);
