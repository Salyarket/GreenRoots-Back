import { test, mock } from "node:test";
import assert from "node:assert";
import AuthController from "../auth.controller.js";
import { PrismaClient } from "@prisma/client";

test("Test register", async () => {
  const fakeModel = {
    create: mock.fn(async () => ({ id: 1, firstname: "Alice" })),
  } as unknown as PrismaClient["user"];

  const controller = new AuthController({} as any, "user");
  controller.model = fakeModel;

  // Utilise l'instance existante mais teste une méthode différente
  const res = { json: mock.fn() };
  const req = {
    body: {
      firstname: "Alice",
      lastname: "Bob",
      email: "alice@bob.com",
      password: "password",
      user_type_id: 1,
    },
  };
  const next = mock.fn();

  // Appel simple pour voir si ça fonctionne
  await controller.register(req as any, res as any, next as any);

  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    message: "New member created",
  });
});
