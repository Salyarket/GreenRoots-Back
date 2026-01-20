import { test, mock } from "node:test";
import assert from "node:assert";
import BaseController from "../base.controller.js";

test("Test getAll products", async () => {
  const fakeData = [
    { id: 1, name: "Cerisier", price: 80 },
    { id: 2, name: "Pommier", price: 60 },
  ];

  const fakeModel = { findMany: mock.fn(async () => fakeData) };

  const controller = new BaseController(fakeModel, "product");

  // Utilise l'instance existante mais teste une méthode différente
  const res = { json: mock.fn() };
  const next = mock.fn();

  // Appel simple pour voir si ça fonctionne
  await controller.getAll({} as any, res as any, next as any);

  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.strictEqual(res.json.mock.calls[0].arguments[0], fakeData);
});

test("Test update product", async () => {
  const fakeData = { id: 1, name: "Cerisier", price: 80 };
  const updatedData = { id: 1, name: "Cerisier", price: 65 };
  const fakeModel = { update: mock.fn(async () => updatedData) };
  const controller = new BaseController(fakeModel, "product");

  // Utilise l'instance existante mais teste une méthode différente
  const res = { json: mock.fn() };
  const req = { params: { id: 1 }, body: updatedData };
  const next = mock.fn();

  // Appel simple pour voir si ça fonctionne
  await controller.update(req as any, res as any, next as any);

  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], updatedData);
});
