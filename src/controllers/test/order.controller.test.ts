import { test, mock } from "node:test";
import assert from "node:assert";
import orderController from "../order.controller.js";
import { PrismaClient } from "@prisma/client";

test("Test createOrder", async () => {
  const fakeModel = {
    create: mock.fn(async () => ({ id: 1, status: "pending", total: 1590 })),
  } as unknown as PrismaClient["order"];

  orderController.model = fakeModel;

  // Utilise l'instance existante mais teste une méthode différente
  const res: any = {};
  const req = {
    body: {
      status: "pending",
      total: 1590,
      user: { id: 2 },
    },
  };
  const next = mock.fn();

  res.status = mock.fn(() => res);
  res.json = mock.fn();

  // Appel simple pour voir si ça fonctionne
  await orderController.createOrder(req as any, res as any, next as any);

  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    id: 1,
    status: "pending",
    total: 1590,
  });
});
