import { test, mock } from "node:test";
import assert from "node:assert";
import productController from "../product.controller.js";

test("Test getAllAvailableWithPagination", async () => {
  // Mock Prisma model
  const fakeModel = {
    findMany: mock.fn(async () => [{ id: 1, name: "Test" }]),
    count: mock.fn(async () => 1),
  };

  // Injection du mock
  (productController as any).model = fakeModel;

  const res = { json: mock.fn() };
  const next = mock.fn();

  await productController.getAllAvailableWithPagination(
    { query: { page: "1", limit: "10" } } as any,
    res as any,
    next as any
  );

  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.strictEqual(fakeModel.findMany.mock.calls.length, 1);
  assert.strictEqual(fakeModel.count.mock.calls.length, 1);
});