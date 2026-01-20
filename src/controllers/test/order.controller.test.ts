import { test, mock, beforeEach } from "node:test";
import assert from "node:assert";

const productFindManyMock = mock.fn(async () => [
  { id: 10, stock: 5, name: "Tilleul" },
]);

const orderCreateMock = mock.fn(async () => ({
  id: 1,
  status: "pending",
  total: 1850,
  items: [],
  user: { id: 2 },
}));

const productUpdateMock = mock.fn(async () => ({}));

const transactionMock = mock.fn(async (cb: any) => {
  return cb({
    order: { create: orderCreateMock },
    product: { update: productUpdateMock },
  });
});

mock.module("../../models/index.js", {
  namedExports: {
    prisma: {
      product: { findMany: productFindManyMock },
      $transaction: transactionMock,
    },
  },
});

const { default: orderController } = await import("../order.controller.js");

beforeEach(() => {
  productFindManyMock.mock.resetCalls();
  orderCreateMock.mock.resetCalls();
  productUpdateMock.mock.resetCalls();
  transactionMock.mock.resetCalls();
});

test("Test createOrder", async () => {
  const res = {
    status: mock.fn(),
    json: mock.fn(),
  };
  res.status.mock.mockImplementation(() => res);

  const req = {
    body: {
      status: "pending",
      total: 1850,
      userId: 2,
      items: [{ productId: 10, quantity: 2, unitPrice: 925 }],
    },
  };
  const next = mock.fn();

  await orderController.createOrder(req as any, res as any, next as any);

  assert.strictEqual(next.mock.calls.length, 0);
  assert.strictEqual(productFindManyMock.mock.calls.length, 1);
  assert.strictEqual(transactionMock.mock.calls.length, 1);
  assert.strictEqual(res.status.mock.calls[0].arguments[0], 201);
  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    id: 1,
    status: "pending",
    total: 1850,
    items: [],
    user: { id: 2 },
  });
});
