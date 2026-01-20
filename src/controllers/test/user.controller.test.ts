import { test, mock } from "node:test";
import assert from "node:assert";
import bcrypt from "bcrypt";
import userController from "../user.controller.js";

// TEST : updateUser = SUCCESS
test("Test updateUser : met à jour un utilisateur et hâche le mdp", async () => {
  // Mock bcrypt.hash
  const hashMock = mock.method(
    bcrypt,
    "hash",
    async () => "HASHED_PASSWORD"
  );

  // Fake Prisma model
  const fakeModel = {
    findUnique: mock.fn(async (args: any) => {
      if (args.where.id === 1) {
        return { id: 1, firstname: "OldName", password: "OLD_HASH" };
      }
      return null;
    }),
    update: mock.fn(async (args: any) => ({
      id: args.where.id,
      ...args.data,
    })),
  } as any;

  // Injection du fake model car on teste une méthode différente
  (userController as any).model = fakeModel;

  const req = {
    params: { id: "1" },
    body: {
      firstname: "NewName",
      password: "newpassword",
    },
  };

  const res = { json: mock.fn() };
  const next = mock.fn();

  await userController.updateUser(req as any, res as any, next as any);

  // on ne doit pas appeler Next car pas d'erreur
  assert.strictEqual(next.mock.calls.length, 0);

  // res.json doit être appelé car user mis à jour
  assert.strictEqual(res.json.mock.calls.length, 1);

  // Vérifie les appels aux mocks
  assert.strictEqual(fakeModel.findUnique.mock.calls.length, 1);

  const updatedUser = res.json.mock.calls[0].arguments[0];
  assert.strictEqual(updatedUser.firstname, "NewName");
  assert.strictEqual(updatedUser.password, "HASHED_PASSWORD");

  hashMock.mock.restore();
});


// updateUser = USER NOT FOUND
test("Test updateUser : appelle next si l'utilisateur n'existe pas", async () => {
  const fakeModel = {
    findUnique: mock.fn(async () => null),
    update: mock.fn(),
  } as any;

  (userController as any).model = fakeModel;

  const req = {
    params: { id: "999" },
    body: { firstname: "Test" },
  };

  const res = { json: mock.fn() };
  const next = mock.fn();

  await userController.updateUser(req as any, res as any, next as any);

  // Aucun JSON renvoyé car user non trouvé
  assert.strictEqual(res.json.mock.calls.length, 0);

  // On doit appeler Next avec une erreur car user non trouvé
  assert.strictEqual(next.mock.calls.length, 1);

  // L'argument doit être une instance d'Error
  assert.ok(
    next.mock.calls[0].arguments[0] instanceof Error);
});
