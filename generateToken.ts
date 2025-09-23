import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "changeme";

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

// lancer "node --loader ts-node/esm generateToken.ts"
