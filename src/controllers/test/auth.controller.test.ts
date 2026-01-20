import assert from "node:assert";
import bcrypt from "bcrypt";
import AuthController from "../auth.controller.js";
import { PrismaClient } from "@prisma/client";
import { test, mock } from "node:test";

test("Test register : créer un user et hâche le mdp", async () => {
  // ARRANGE : arrangement des données de test
  const hashMock = mock.method(
    bcrypt,
    "hash",
    async () => "HASHED_PASSWORD"
  );

  const fakeModel = {
    create: mock.fn(async () => ({ id: 1, firstname: "Lina" })),
  } as unknown as PrismaClient["user"];

  const controller = new AuthController({} as any, "user");
  controller.model = fakeModel;

  // Utilise l'instance existante mais teste une méthode différente
  const res = { json: mock.fn() };
  const req = {
    body: {
      firstname: "Lina",
      lastname: "Billie",
      email: "lina@test.com",
      password: "password",
      user_type_id: 1,
    },
  };
  const next = mock.fn();

  // ACT : appel de la fonction à tester
  await controller.register(req as any, res as any, next as any);

  // ASSERT : vérifications
  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    message: "Nouveau membre créé",
  });
  assert.strictEqual(fakeModel.create.mock.calls.length, 1);
  const createdUser = fakeModel.create.mock.calls[0].arguments[0];
  assert.strictEqual(createdUser.data.password, "HASHED_PASSWORD");

  // Nettoyage des mocks
  hashMock.mock.restore();
});
