import { test, mock, beforeEach } from "node:test";
import assert from "node:assert";

// 1- On prépare les variables de .env AVANT d'importer le controller
process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
process.env.APP_URL = "http://localhost:3000";

// 2- Mocks "globaux" : Stripe & Prisma, utilisés par le module
const stripeCreateMock = mock.fn(async (...args: any[]) => {
  void args;
  return { url: "https://checkout.stripe.com/session/test" };
});

const defaultOrder = () => ({
  id: 1,
  items: [
    {
      quantity: 2,
      product: { name: "Peuplier", price: 75 },
    },
  ],
});

const prismaFindFirstMock = mock.fn(async (): Promise<any> => defaultOrder());

// 3- Mock du module Stripe (ESM)
mock.module("stripe", {
  defaultExport: class Stripe {
    checkout = {
      sessions: {
        create: stripeCreateMock,
      },
    };
    constructor(key: string) {
      void key;
    }
  },
});

// 4- Mock du module Prisma (ESM)
mock.module("@prisma/client", {
  namedExports: {
    PrismaClient: class PrismaClient {
      order = {
        findFirst: prismaFindFirstMock,
      };
    },
  },
});

// 5- Attention : on importe le controller APRÈS les mock.module
const { createCheckoutSession } = await import("../payments.controller.js");

type MockFn = ReturnType<typeof mock.fn>;
type MockRes = {
  json: MockFn;
  status: MockFn;
};

function makeRes() {
  const res: MockRes = {
    json: mock.fn(),
    status: mock.fn(),
  };
  res.status.mock.mockImplementation(() => res);
  return res;
}

beforeEach(() => {
  stripeCreateMock.mock.resetCalls();
  prismaFindFirstMock.mock.resetCalls();
  prismaFindFirstMock.mock.mockImplementation(async () => defaultOrder());
});

// SUCCESS
test("Test createCheckoutSession : ok => renvoie l'url Stripe", async () => {
  // ARRANGE : arrangement des données de test
  const req = { body: { orderId: 1 }, userId: 1 };
  const res = makeRes();
  const next = mock.fn();

  // ACT : appel de la fonction à tester
  await createCheckoutSession(req as any, res as any, next as any);

  // ASSERT : vérifications
  assert.strictEqual(next.mock.calls.length, 0);

  // On appelle Prisma
  assert.strictEqual(prismaFindFirstMock.mock.calls.length, 1);

  // On appelle Stripe
  assert.strictEqual(stripeCreateMock.mock.calls.length, 1);

  // Voici la réponse
  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    url: "https://checkout.stripe.com/session/test",
  });

  // Petit plus : on vérifie que Stripe reçoit bien metadata & les line_items
  const stripeArgs = stripeCreateMock.mock.calls[0].arguments[0] as any;
  assert.strictEqual(stripeArgs.mode, "payment");
  assert.ok(Array.isArray(stripeArgs.line_items));
  assert.deepStrictEqual(stripeArgs.metadata, { orderId: "1", userId: "1" });
});

// orderId manquant
test("Test createCheckoutSession : orderId manquant => 400", async () => {
  const req = { body: {}, userId: 1 };
  const res = makeRes();
  const next = mock.fn();

  await createCheckoutSession(req as any, res as any, next as any);

  assert.strictEqual(res.status.mock.calls.length, 1);
  assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    error: "orderId manquant",
  });

  // Stripe/Prisma ne doivent pas être appelés car erreur avant
  assert.strictEqual(prismaFindFirstMock.mock.calls.length, 0);
  assert.strictEqual(stripeCreateMock.mock.calls.length, 0);
  assert.strictEqual(next.mock.calls.length, 0);
});

// Non authentifié
test("Test createCheckoutSession : non authentifié => 401", async () => {
  const req = { body: { orderId: 1 }, userId: undefined };
  const res = makeRes();
  const next = mock.fn();

  await createCheckoutSession(req as any, res as any, next as any);

  assert.strictEqual(res.status.mock.calls.length, 1);
  assert.strictEqual(res.status.mock.calls[0].arguments[0], 401);
  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    error: "Non authentifié",
  });

  assert.strictEqual(prismaFindFirstMock.mock.calls.length, 0);
  assert.strictEqual(stripeCreateMock.mock.calls.length, 0);
  assert.strictEqual(next.mock.calls.length, 0);
});

// Commande introuvable
test("Test createCheckoutSession : commande non trouvée => 404", async () => {
  prismaFindFirstMock.mock.mockImplementationOnce(async () => null);

  const req = { body: { orderId: 999 }, userId: 1 };
  const res = makeRes();
  const next = mock.fn();

  await createCheckoutSession(req as any, res as any, next as any);

  assert.strictEqual(res.status.mock.calls.length, 1);
  assert.strictEqual(res.status.mock.calls[0].arguments[0], 404);
  assert.strictEqual(res.json.mock.calls.length, 1);
  assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], {
    error: "Commande introuvable",
  });

  // Stripe ne doit pas être appelé parce que erreur avant
  assert.strictEqual(stripeCreateMock.mock.calls.length, 0);
  assert.strictEqual(next.mock.calls.length, 0);
});

// Prix produit invalide => next(err)
test("Test createCheckoutSession : prix du produit invalide => next(err)", async () => {
  prismaFindFirstMock.mock.mockImplementationOnce(async () => ({
    id: 1,
    items: [{ quantity: 1, product: { name: "Stuff", price: Number.NaN } }],
  }));

  const req = { body: { orderId: 1 }, userId: 1 };
  const res = makeRes();
  const next = mock.fn();

  await createCheckoutSession(req as any, res as any, next as any);

  assert.strictEqual(next.mock.calls.length, 1);
  assert.ok(next.mock.calls[0].arguments[0] instanceof Error);

  // Stripe ne doit pas être appelé car erreur avant
  assert.strictEqual(stripeCreateMock.mock.calls.length, 0);
});
