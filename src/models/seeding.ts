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
    data: [
      {
        firstname: "admin",
        lastname: "admin",
        email: "admin@admin.com",
        password:
          "$2b$10$nY7OHHb/TS21LeCSGdc4A.f9UgvrrjfCkvSCpg59my4j2StLQrMAO",
        role: Role.admin,
        user_type_id: 1,
      },
      {
        firstname: "member",
        lastname: "member",
        email: "member@member.com",
        password:
          "$2b$10$nY7OHHb/TS21LeCSGdc4A.f9UgvrrjfCkvSCpg59my4j2StLQrMAO",
        role: Role.member,
        user_type_id: 2,
      },
      {
        firstname: "Claire",
        lastname: "Dupont",
        email: "claire@example.com",
        password:
          "$2b$10$nY7OHHb/TS21LeCSGdc4A.f9UgvrrjfCkvSCpg59my4j2StLQrMAO",
        role: Role.member,
        user_type_id: 3,
      },
      {
        firstname: "guillaume",
        lastname: "ferard",
        email: "guillaume@ferard.com",
        password:
          "$2b$10$nY7OHHb/TS21LeCSGdc4A.f9UgvrrjfCkvSCpg59my4j2StLQrMAO",
        role: Role.member,
        user_type_id: 5,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seeding Users Done ✅");

  const users = await prisma.user.findMany();

  // ============================
  // Locations (10)
  // ============================
  console.log("🌱🌱🌱 Starting seeding Locations...🌱🌱");

  await prisma.location.createMany({
    data: [
      { name: "Terrain Nord", latitude: 48.8566, longitude: 2.3522 },
      { name: "Terrain Sud", latitude: 43.2965, longitude: 5.3698 },
      { name: "Terrain Est", latitude: 45.764, longitude: 4.8357 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seeding Locations Done ✅");

  const locations = await prisma.location.findMany();

  // ============================
  // Products (20 arbres)
  // ============================
  console.log("🌱🌱🌱 Starting seeding Products...🌱🌱");

  await prisma.product.createMany({
    data: [
      {
        name: "Chêne",
        slug: "chene",
        price: 100,
        description: "Un grand arbre robuste",
        image_urls: ["chene.jpg"],
        stock: 50,
        scientific_name: "Quercus robur",
        carbon: 30,
      },
      {
        name: "Érable",
        slug: "erable",
        price: 80,
        description: "Arbre aux feuilles rouges à l’automne",
        image_urls: ["erable.jpg"],
        stock: 40,
        scientific_name: "Acer saccharum",
        carbon: 25,
      },
      {
        name: "Olivier",
        slug: "olivier",
        price: 120,
        description: "Arbre méditerranéen produisant des olives",
        image_urls: ["olivier.jpg"],
        stock: 30,
        scientific_name: "Olea europaea",
        carbon: 20,
      },
      {
        name: "Pin",
        slug: "pin",
        price: 70,
        description: "Arbre à aiguilles résineux",
        image_urls: ["pin.jpg"],
        stock: 60,
        scientific_name: "Pinus sylvestris",
        carbon: 15,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeding Products Done ✅");

  const products = await prisma.product.findMany();

  // ============================
  // Product-Location relations
  // ============================
  console.log("🌱 Linking Products to Locations...");
  await prisma.productLocation.createMany({
    data: [
      { product_id: products[0].id, location_id: locations[0].id },
      { product_id: products[1].id, location_id: locations[1].id },
      { product_id: products[2].id, location_id: locations[2].id },
      { product_id: products[3].id, location_id: locations[0].id },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Product-Location relations seeded");

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
