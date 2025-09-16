import { PrismaClient, Role, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // ============================
  // User Types
  // ============================
  const proType = await prisma.userType.create({
    data: { code: "PRO", label: "Professionnel", tva_rate: 20.0 },
  });
  const particulierType = await prisma.userType.create({
    data: { code: "PART", label: "Particulier", tva_rate: 20.0 },
  });
  const associationType = await prisma.userType.create({
    data: { code: "Asso", label: "Association", tva_rate: 5.5 },
  });
  const entrepriseType = await prisma.userType.create({
    data: { code: "Ent", label: "Entreprise", tva_rate: 20 },
  });
  const autoEntrepreneurType = await prisma.userType.create({
    data: { code: "AutoEnt", label: "Auto Entrepreneur", tva_rate: 20 },
  });

  // ============================
  // Users
  // ============================
  const adminUser = await prisma.user.create({
    data: {
      firstname: "Admin",
      lastname: "Admin",
      email: "admin@admin.com",
      entity_name: "GreenRoots",
      password: "test",
      role: Role.admin,
      userType: { connect: { id: proType.id } },
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      firstname: "Bob",
      lastname: "Member",
      email: "bob@bob.com",
      password: "test",
      role: Role.member,
      userType: { connect: { id: particulierType.id } },
    },
  });

  const entrepriseUser = await prisma.user.create({
    data: {
      firstname: "Guillaume",
      lastname: "Ferard",
      email: "guillaume@guillaume.com",
      entity_name: "O'Clock",
      password: "test",
      role: Role.member,
      userType: { connect: { id: entrepriseType.id } },
    },
  });

  const assoUser = await prisma.user.create({
    data: {
      firstname: "Claire",
      lastname: "Asso",
      email: "claire@asso.com",
      entity_name: "Planète Verte",
      password: "test",
      role: Role.member,
      userType: { connect: { id: associationType.id } },
    },
  });

  const autoEntUser = await prisma.user.create({
    data: {
      firstname: "Julien",
      lastname: "Auto",
      email: "julien@auto.com",
      entity_name: "EcoTree Services",
      password: "test",
      role: Role.member,
      userType: { connect: { id: autoEntrepreneurType.id } },
    },
  });

  // ============================
  // Locations
  // ============================
  const location1 = await prisma.location.create({
    data: { name: "Parc National", latitude: 45.764, longitude: 4.8357 },
  });

  const location2 = await prisma.location.create({
    data: { name: "Jardin Botanique", latitude: 48.8566, longitude: 2.3522 },
  });

  // ============================
  // Products
  // ============================
  const arbre1 = await prisma.product.create({
    data: {
      name: "Chêne",
      slug: "chene",
      price: 49.99,
      description: "Un arbre robuste et majestueux.",
      image_urls: ["chene1.jpg", "chene2.jpg"],
      stock: 1000,
      scientific_name: "Quercus robur",
      carbon: 12.5,
      productLocations: { create: [{ location_id: location1.id }] },
    },
  });

  const arbre2 = await prisma.product.create({
    data: {
      name: "Érable",
      slug: "erable",
      price: 39.99,
      description: "Un arbre magnifique aux feuilles colorées.",
      image_urls: ["erable1.jpg", "erable2.jpg"],
      stock: 1000,
      scientific_name: "Acer saccharum",
      carbon: 9.2,
      productLocations: { create: [{ location_id: location2.id }] },
    },
  });

  // ============================
  // Orders (10 commandes)
  // ============================
  const users = [adminUser, memberUser, entrepriseUser, assoUser, autoEntUser];
  const products = [arbre1, arbre2];

  for (let i = 1; i <= 10; i++) {
    const user = users[i % users.length];
    const productMix = [
      {
        product: products[0],
        quantity: Math.floor(Math.random() * 50) + 10, // entre 10 et 60
      },
      {
        product: products[1],
        quantity: Math.floor(Math.random() * 30) + 5, // entre 5 et 35
      },
    ];

    const total = productMix.reduce(
      (sum, item) => sum + item.quantity * Number(item.product.price),
      0
    );

    await prisma.order.create({
      data: {
        status: i % 2 === 0 ? OrderStatus.paid : OrderStatus.pending,
        total: total,
        user: { connect: { id: user.id } },
        items: {
          create: productMix.map((item) => ({
            quantity: item.quantity,
            unit_price: item.product.price,
            product: { connect: { id: item.product.id } },
          })),
        },
      },
    });
  }

  console.log("✅ 10 Orders seeding done");
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
