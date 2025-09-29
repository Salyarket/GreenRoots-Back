import { PrismaClient, Role, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ============================
  // User Types
  // ============================
  console.log("🌱🌱🌱 Starting seeding UserType...🌱🌱");

  await prisma.userType.createMany({
    data: [
      { code: "PART", label: "Particulier", tva_rate: 20.0 },
      { code: "ASSO", label: "Association", tva_rate: 5.5 },
      { code: "ENT", label: "Entreprise", tva_rate: 20.0 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seeding UserType Done ✅");

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
        user_type_id: 3,
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
      // Nord
      { name: "Terrain Lille", latitude: 50.6292, longitude: 3.0573 },
      { name: "Terrain Amiens", latitude: 49.895, longitude: 2.3023 },

      // Île-de-France
      { name: "Terrain Paris", latitude: 48.8566, longitude: 2.3522 },
      { name: "Terrain Versailles", latitude: 48.8049, longitude: 2.1204 },

      // Ouest
      { name: "Terrain Nantes", latitude: 47.2184, longitude: -1.5536 },
      { name: "Terrain Rennes", latitude: 48.1173, longitude: -1.6778 },

      // Sud-Ouest
      { name: "Terrain Bordeaux", latitude: 44.8378, longitude: -0.5792 },
      { name: "Terrain Toulouse", latitude: 43.6047, longitude: 1.4442 },

      // Sud-Est
      { name: "Terrain Marseille", latitude: 43.2965, longitude: 5.3698 },
      { name: "Terrain Nice", latitude: 43.7102, longitude: 7.262 },

      // Est
      { name: "Terrain Lyon", latitude: 45.764, longitude: 4.8357 },
      { name: "Terrain Strasbourg", latitude: 48.5734, longitude: 7.7521 },

      // Centre
      { name: "Terrain Clermont-Ferrand", latitude: 45.7772, longitude: 3.087 },
      { name: "Terrain Orléans", latitude: 47.9029, longitude: 1.9093 },
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
        name: "Chêne pédonculé",
        slug: "chene-pedoncule",
        price: 90,
        description:
          "Arbre majestueux d'Europe, symbole de longévité et de biodiversité.",
        image_urls: [
          "chene-pedoncule.webp",
          "chene-pedoncule_2.webp",
          "chene-pedoncule_3.webp",
        ],
        stock: 100,
        scientific_name: "Quercus robur",
        carbon: 30,
      },
      {
        name: "Hêtre commun",
        slug: "hetre",
        price: 80,
        description: "Arbre élégant très répandu dans les forêts françaises.",
        image_urls: ["hetre.webp", "hetre_2.webp", "hetre_3.webp"],
        stock: 80,
        scientific_name: "Fagus sylvatica",
        carbon: 25,
      },
      {
        name: "Sapin pectiné",
        slug: "sapin",
        price: 85,
        description: "Conifère emblématique des Vosges et des Alpes.",
        image_urls: ["sapin.webp", "sapin_2.webp"],
        stock: 70,
        scientific_name: "Abies alba",
        carbon: 28,
      },
      {
        name: "Châtaignier",
        slug: "chataignier",
        price: 95,
        description:
          "Arbre producteur de châtaignes, très apprécié en Ardèche et en Corse.",
        image_urls: ["chataignier.webp", "chataignier_2.webp"],
        stock: 60,
        scientific_name: "Castanea sativa",
        carbon: 27,
      },
      {
        name: "Peuplier",
        slug: "peuplier",
        price: 75,
        description:
          "Arbre à croissance rapide, souvent utilisé pour le reboisement.",
        image_urls: ["peuplier.webp"],
        stock: 120,
        scientific_name: "Populus alba",
        carbon: 22,
      },
      {
        name: "Frêne commun",
        slug: "frene",
        price: 85,
        description: "Arbre résistant et utile pour la biodiversité.",
        image_urls: ["frene.webp"],
        stock: 90,
        scientific_name: "Fraxinus excelsior",
        carbon: 23,
      },
      {
        name: "Orme champêtre",
        slug: "orme",
        price: 100,
        description:
          "Arbre noble, jadis répandu dans les campagnes françaises.",
        image_urls: ["orme.webp"],
        stock: 50,
        scientific_name: "Ulmus minor",
        carbon: 26,
      },
      {
        name: "Platane",
        slug: "platane",
        price: 95,
        description:
          "Arbre d'alignement typique des routes et places en Europe.",
        image_urls: ["platane.webp"],
        stock: 70,
        scientific_name: "Platanus acerifolia",
        carbon: 24,
      },
      {
        name: "Tilleul",
        slug: "tilleul",
        price: 85,
        description:
          "Arbre ornemental et mellifère, apprécié pour ses fleurs apaisantes.",
        image_urls: ["tilleul.webp", "tilleul_2.webp", "tilleul_3.webp"],
        stock: 100,
        scientific_name: "Tilia cordata",
        carbon: 21,
      },
      {
        name: "Bouleau verruqueux",
        slug: "bouleau",
        price: 70,
        description: "Arbre pionnier reconnaissable à son écorce blanche.",
        image_urls: [
          "bouleau-verruqueux.webp",
          "bouleau_verruqueux_2.webp",
          "bouleau_verruqueux_3.webp",
        ],
        stock: 110,
        scientific_name: "Betula pendula",
        carbon: 18,
      },

      // 🌱 NOUVEAUX (6)
      {
        name: "Érable sycomore",
        slug: "erable-sycomore",
        price: 80,
        description:
          "Arbre majestueux aux grandes feuilles, très présent en Europe.",
        image_urls: [
          "erable_sycomore.webp",
          "erable_sycomore_2.webp",
          "erable_sycomore_3.webp",
        ],
        stock: 85,
        scientific_name: "Acer pseudoplatanus",
        carbon: 24,
      },
      {
        name: "Aulne glutineux",
        slug: "aulne",
        price: 70,
        description: "Arbre aimant l'eau, fréquent le long des rivières.",
        image_urls: [
          "aulne_glutineux.webp",
          "aulne_glutineux_2.webp",
          "aulne_glutineux_3.webp",
        ],
        stock: 75,
        scientific_name: "Alnus glutinosa",
        carbon: 20,
      },
      {
        name: "Saule pleureur",
        slug: "saule-pleureur",
        price: 95,
        description:
          "Arbre ornemental très reconnaissable, souvent au bord de l'eau.",
        image_urls: [
          "saule_pleureur.webp",
          "saule_pleureur_2.webp",
          "saule_pleureur_3.webp",
        ],
        stock: 60,
        scientific_name: "Salix babylonica",
        carbon: 22,
      },
      {
        name: "Cèdre de l'Atlas",
        slug: "cedre-atlas",
        price: 120,
        description:
          "Conifère emblématique, originaire d'Afrique du Nord mais présent en France.",
        image_urls: [
          "cedre_atlas.webp",
          "cedre_atlas_2.webp",
          "cedre_atlas_3.webp",
        ],
        stock: 50,
        scientific_name: "Cedrus atlantica",
        carbon: 35,
      },
      {
        name: "Noyer commun",
        slug: "noyer",
        price: 100,
        description:
          "Arbre produisant des noix, apprécié pour son bois précieux.",
        image_urls: [
          "noyer_commun 1.webp",
          "noyer_commun_2.webp",
          "noyer_commun_3.webp",
        ],
        stock: 65,
        scientific_name: "Juglans regia",
        carbon: 28,
      },
      {
        name: "Charme commun",
        slug: "charme",
        price: 85,
        description: "Arbre robuste souvent utilisé en haies et alignements.",
        image_urls: [
          "charme_commun.webp",
          "charme_commun_2.webp",
          "charme_commun_3.webp",
        ],
        stock: 90,
        scientific_name: "Carpinus betulus",
        carbon: 23,
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
      // 1. Chêne pédonculé
      { product_id: products[0].id, location_id: locations[0].id },
      { product_id: products[0].id, location_id: locations[1].id },

      // 2. Hêtre commun
      { product_id: products[1].id, location_id: locations[2].id },
      { product_id: products[1].id, location_id: locations[3].id },

      // 3. Sapin pectiné
      { product_id: products[2].id, location_id: locations[4].id },
      { product_id: products[2].id, location_id: locations[5].id },

      // 4. Châtaignier
      { product_id: products[3].id, location_id: locations[6].id },
      { product_id: products[3].id, location_id: locations[7].id },

      // 5. Peuplier
      { product_id: products[4].id, location_id: locations[8].id },
      { product_id: products[4].id, location_id: locations[9].id },

      // 6. Frêne commun
      { product_id: products[5].id, location_id: locations[10].id },
      { product_id: products[5].id, location_id: locations[11].id },

      // 7. Orme champêtre
      { product_id: products[6].id, location_id: locations[12].id },
      { product_id: products[6].id, location_id: locations[13].id },

      // 8. Platane
      { product_id: products[7].id, location_id: locations[0].id },
      { product_id: products[7].id, location_id: locations[1].id },

      // 9. Tilleul
      { product_id: products[8].id, location_id: locations[2].id },
      { product_id: products[8].id, location_id: locations[3].id },

      // 10. Bouleau verruqueux
      { product_id: products[9].id, location_id: locations[4].id },
      { product_id: products[9].id, location_id: locations[5].id },

      // 11. Érable sycomore
      { product_id: products[10].id, location_id: locations[6].id },
      { product_id: products[10].id, location_id: locations[7].id },

      // 12. Aulne glutineux
      { product_id: products[11].id, location_id: locations[8].id },
      { product_id: products[11].id, location_id: locations[9].id },

      // 13. Saule pleureur
      { product_id: products[12].id, location_id: locations[10].id },
      { product_id: products[12].id, location_id: locations[11].id },

      // 14. Cèdre de l’Atlas
      { product_id: products[13].id, location_id: locations[12].id },
      { product_id: products[13].id, location_id: locations[13].id },

      // 15. Noyer commun
      { product_id: products[14].id, location_id: locations[0].id },
      { product_id: products[14].id, location_id: locations[2].id },

      // 16. Charme commun
      { product_id: products[15].id, location_id: locations[4].id },
      { product_id: products[15].id, location_id: locations[6].id },
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
