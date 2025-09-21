import { PrismaClient, Role, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ============================
  // User Types
  // ============================
  console.log("🌱🌱🌱 Starting seeding UserType...🌱🌱");

  await prisma.userType.createMany({
    data: [
      { code: "PRO", label: "Professionnel", tva_rate: 20.0 },
      { code: "PART", label: "Particulier", tva_rate: 20.0 },
      { code: "ASSO", label: "Association", tva_rate: 5.5 },
      { code: "ENT", label: "Entreprise", tva_rate: 20.0 },
      { code: "AUTOENT", label: "Auto Entrepreneur", tva_rate: 20.0 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seeding UserType Done ✅");

  const userTypes = await prisma.userType.findMany();

  // ============================
  // Users (10)
  // ============================
  console.log("🌱🌱🌱 Starting seeding Users...🌱🌱");

  await prisma.user.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      firstname: `User${i + 1}`,
      lastname: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: "password",
      role: i === 0 ? Role.admin : Role.member,
      user_type_id: userTypes[i % userTypes.length].id,
    })),
    skipDuplicates: true,
  });
  console.log("✅ Seeding Users Done ✅");

  const users = await prisma.user.findMany();

  // ============================
  // Locations (10)
  // ============================
  console.log("🌱🌱🌱 Starting seeding Locations...🌱🌱");

  await prisma.location.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Location ${i + 1}`,
      latitude: 40.0 + i,
      longitude: -70.0 - i,
    })),
    skipDuplicates: true,
  });
  console.log("✅ Seeding Locations Done ✅");

  const locations = await prisma.location.findMany();

  // ============================
  // Products (20 arbres)
  // ============================
  console.log("🌱🌱🌱 Starting seeding Products...🌱🌱");

  await prisma.product.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({
      name: `Arbre ${i + 1}`,
      slug: `arbre-${i + 1}`,
      price: 50 + i * 10, // prix progressif
      description: `Description arbre ${i + 1}`,
      image_urls: [`arbre${i + 1}.jpg`],
      stock: 100 + i * 10,
      scientific_name: `Species ${i + 1}`,
      carbon: 10 + i,
    })),
    skipDuplicates: true,
  });
  console.log("✅ Seeding Products Done ✅");

  const products = await prisma.product.findMany();

  // Relier chaque produit à une location
  await prisma.productLocation.createMany({
    data: products.map((p, i) => ({
      product_id: p.id,
      location_id: locations[i % locations.length].id,
    })),
    skipDuplicates: true,
  });

  // ============================
  // Orders (20 commandes)
  // ============================
  console.log("🌱🌱🌱 Starting seeding Orders...🌱🌱");

  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length];

    // Sélectionner entre 3 et 5 produits différents
    const nbItems = 3 + (i % 3); // 3, 4 ou 5
    const chosenProducts = products.slice(i, i + nbItems);

    // Construire les items avec quantités progressives
    const items = chosenProducts.map((product, idx) => ({
      quantity: 10 + idx + i, // quantités progressives
      unit_price: product.price,
      product: { connect: { id: product.id } },
    }));

    // Calculer le total
    const total = items.reduce(
      (sum, item) => sum + item.quantity * Number(item.unit_price),
      0
    );

    await prisma.order.create({
      data: {
        status: i % 2 === 0 ? OrderStatus.paid : OrderStatus.pending,
        total,
        user: { connect: { id: user.id } },
        items: { create: items },
      },
    });
  }

  console.log("✅ Seeding Orders Done ✅");

  console.log("🚀🚀🚀 Seeding finished 🚀🚀🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
