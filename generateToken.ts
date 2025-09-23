import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET manquant dans .env");
}

const tokenAdmin = jwt.sign(
  { userId: 1, role: "admin" },
  secret,
  { expiresIn: "1h" }
);

const tokenMember = jwt.sign(
  { userId: 2, role: "member" },
  secret,
  { expiresIn: "1h" }
);

console.log("Admin:", tokenAdmin);
console.log("Member:", tokenMember);
