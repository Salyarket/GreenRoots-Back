import { test, mock } from "node:test";
import assert from "node:assert";
import productController from "../product.controller.js";

test("Test getAllAvailableWithPagination", async () => {
  // Utilise l'instance existante mais teste une méthode différente
  const res = { json: mock.fn() };
  const next = mock.fn();

  // Appel simple pour voir si ça fonctionne
  await productController.getAllAvailableWithPagination(
    { query: { page: "1", limit: "10" } } as any,
    res as any,
    next as any
  );

  assert.strictEqual(res.json.mock.calls.length, 1);
});
