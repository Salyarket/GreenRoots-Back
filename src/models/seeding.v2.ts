import { PrismaClient, Role, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // ============================
  // User Types
  // ============================

  await prisma.userType.createMany({
    data: [
      { code: "PRO", label: "Professionnel", tva_rate: 20.0 },
      { code: "PART", label: "Particulier", tva_rate: 20.0 },
      { code: "Asso", label: "Association", tva_rate: 5.5 },
      { code: "Ent", label: "Entreprise", tva_rate: 20.0 },
      { code: "AutoEnt", label: "Auto Entrepreneur", tva_rate: 20.0 },
    ],
    skipDuplicates: true, // optionnel : évite les erreurs si certains codes existent déjà
  });

  console.log("✅ Tous les types d'utilisateurs");

  // ============================
  // Users
  // ============================

  await prisma.user.createMany({
    data: [
      { firstname: "Admin", lastname: "Admin", email: "admin@admin.com", entity_name: "GreenRoots", password: "test", role: Role.admin, user_type_id: 1 },
      { firstname: "Bob", lastname: "Member", email: "bob@bob.com", password: "test", role: Role.member, user_type_id: 2 },
      { firstname: "Guillaume", lastname: "Ferard", email: "guillaume@guillaume.com", entity_name: "O'Clock", password: "test", role: Role.member, user_type_id: 3 },
      { firstname: "Claire", lastname: "Asso", email: "claire@asso.com", entity_name: "Planète Verte", password: "test", role: Role.member, user_type_id: 4 },
      { firstname: "Julien", lastname: "Auto", email: "julien@auto.com", entity_name: "EcoTree Services", password: "test", role: Role.member, user_type_id: 5 },
      { firstname: "Alice", lastname: "Martin", email: "alice.martin@example.com", password: "test", role: Role.member, user_type_id: 2 },
      { firstname: "David", lastname: "Leroy", email: "david.leroy@example.com", password: "test", role: Role.member, user_type_id: 2 },
      { firstname: "Sophie", lastname: "Dubois", email: "sophie.dubois@example.com", password: "test", role: Role.member, user_type_id: 2 },
      { firstname: "Thomas", lastname: "Moreau", email: "thomas.moreau@example.com", password: "test", role: Role.member, user_type_id: 2 },
      { firstname: "Emma", lastname: "Petit", email: "emma.petit@example.com", password: "test", role: Role.member, user_type_id: 2 },
      { firstname: "Lucas", lastname: "Roux", email: "lucas.roux@example.com", password: "test", role: Role.member, user_type_id: 3 },
      { firstname: "Chloé", lastname: "Blanc", email: "chloe.blanc@example.com", password: "test", role: Role.member, user_type_id: 3 },
      { firstname: "Maxime", lastname: "Faure", email: "maxime.faure@example.com", password: "test", role: Role.member, user_type_id: 4 },
      { firstname: "Camille", lastname: "Garnier", email: "camille.garnier@example.com", password: "test", role: Role.member, user_type_id: 5 },
      { firstname: "Nathan", lastname: "Henry", email: "nathan.henry@example.com", password: "test", role: Role.member, user_type_id: 2 },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Tous les utilisateurs");

  // ============================
  // Locations
  // ============================

  await prisma.location.createMany({
    data: [
      { name: "Parc National", latitude: 45.764, longitude: 4.8357 },
      { name: "Jardin Botanique", latitude: 48.8566, longitude: 2.3522 },
      { name: "Forêt de Fontainebleau", latitude: 48.403, longitude: 2.699 },
      { name: "Lac Léman", latitude: 46.428, longitude: 6.567 },
      { name: "Mont Blanc", latitude: 45.832, longitude: 6.865 },
      { name: "Plage de Nice", latitude: 43.695, longitude: 7.265 },
      { name: "Vallée de la Loire", latitude: 47.414, longitude: 0.689 },
      { name: "Gorges du Verdon", latitude: 43.737, longitude: 6.349 },
      { name: "Château de Versailles", latitude: 48.804, longitude: 2.120 },
      { name: "Mont Saint-Michel", latitude: 48.636, longitude: -1.511 },
      { name: "Camargue", latitude: 43.556, longitude: 4.437 },
      { name: "Dune du Pilat", latitude: 44.589, longitude: -1.212 },
      { name: "Parc du Mercantour", latitude: 44.168, longitude: 7.409 },
      { name: "Gorges de l'Ardèche", latitude: 44.418, longitude: 4.422 },
      { name: "Puy de Dôme", latitude: 45.772, longitude: 2.969 },
      { name: "Baie de Somme", latitude: 50.168, longitude: 1.607 },
      { name: "Plateau de Valensole", latitude: 43.824, longitude: 5.902 },
      { name: "Lac d’Annecy", latitude: 45.899, longitude: 6.129 },
      { name: "Col de l’Iseran", latitude: 45.445, longitude: 6.722 },
      { name: "Parc des Écrins", latitude: 44.924, longitude: 6.325 },
      { name: "Grotte de Lascaux", latitude: 45.053, longitude: 1.166 },
      { name: "Château de Chambord", latitude: 47.616, longitude: 1.516 },
      { name: "Vignoble de Bordeaux", latitude: 44.841, longitude: -0.580 },
      { name: "Plage de Biarritz", latitude: 43.483, longitude: -1.558 },
      { name: "Île de Ré", latitude: 46.174, longitude: -1.359 },
      { name: "Massif des Vosges", latitude: 48.083, longitude: 7.207 },
      { name: "Parc du Vexin", latitude: 49.066, longitude: 1.792 },
      { name: "Lac du Bourget", latitude: 45.7, longitude: 5.9 },
      { name: "Monts d’Arrée", latitude: 48.366, longitude: -3.813 },
      { name: "Gorges de la Sioule", latitude: 46.022, longitude: 3.438 },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Tous les localisations");

  // ============================
  // Products
  // ============================

  await prisma.product.createMany({ 
    data: [
      { name: "Chêne", slug: "chene", price: 49.99, description: "Un arbre robuste et majestueux.", image_urls: ["chene1.jpg","chene2.jpg"], stock: 1000, scientific_name: "Quercus robur", carbon: 12.5 ,productLocations : [1, 2]},
      { name: "Érable", slug: "erable", price: 39.99, description: "Un arbre magnifique aux feuilles colorées.", image_urls: ["erable1.jpg","erable2.jpg"], stock: 1000, scientific_name: "Acer saccharum", carbon: 9.2 ,productLocations : [1, 3]},
      { name: "Pin", slug: "pin", price: 29.99, description: "Arbre résineux qui pousse rapidement.", image_urls: ["pin1.jpg","pin2.jpg"], stock: 1000, scientific_name: "Pinus sylvestris", carbon: 8.1 ,productLocations : [4, 5]},
      { name: "Sapin", slug: "sapin", price: 34.99, description: "Idéal pour les régions froides.", image_urls: ["sapin1.jpg","sapin2.jpg"], stock: 1000, scientific_name: "Abies alba", carbon: 10.3 ,productLocations : [5, 6]},
      { name: "Bouleau", slug: "bouleau", price: 27.99, description: "Arbre élégant à écorce blanche.", image_urls: ["bouleau1.jpg","bouleau2.jpg"], stock: 1000, scientific_name: "Betula pendula", carbon: 7.8 ,productLocations : [7, 8, 9]},
      { name: "Tilleul", slug: "tilleul", price: 32.99, description: "Arbre aux fleurs parfumées.", image_urls: ["tilleul1.jpg","tilleul2.jpg"], stock: 1000, scientific_name: "Tilia cordata", carbon: 9.5 ,productLocations : [2, 3]},
      { name: "Peuplier", slug: "peuplier", price: 22.99, description: "Arbre à croissance rapide.", image_urls: ["peuplier1.jpg","peuplier2.jpg"], stock: 1000, scientific_name: "Populus nigra", carbon: 6.7 ,productLocations : [4, 10]},
      { name: "Châtaignier", slug: "chataignier", price: 44.99, description: "Arbre à bois précieux et fruits comestibles.", image_urls: ["chataignier1.jpg","chataignier2.jpg"], stock: 1000, scientific_name: "Castanea sativa", carbon: 11.2 ,productLocations : [12, 14]},
      { name: "Frêne", slug: "frene", price: 31.99, description: "Arbre solide et droit.", image_urls: ["frene1.jpg","frene2.jpg"], stock: 1000, scientific_name: "Fraxinus excelsior", carbon: 9.1 ,productLocations : [11, 13]},
      { name: "Orme", slug: "orme", price: 28.99, description: "Arbre majestueux aux feuilles ciselées.", image_urls: ["orme1.jpg","orme2.jpg"], stock: 1000, scientific_name: "Ulmus glabra", carbon: 8.7 ,productLocations : [15, 16]},
      { name: "Marronnier", slug: "marronnier", price: 35.99, description: "Arbre à fleurs blanches et fruits marron.", image_urls: ["marronnier1.jpg","marronnier2.jpg"], stock: 1000, scientific_name: "Aesculus hippocastanum", carbon: 10.1 ,productLocations : [17, 18]},
      { name: "Magnolia", slug: "magnolia", price: 42.99, description: "Arbre ornemental aux grandes fleurs.", image_urls: ["magnolia1.jpg","magnolia2.jpg"], stock: 1000, scientific_name: "Magnolia grandiflora", carbon: 11.5 ,productLocations : [19, 20]},
      { name: "Cèdre", slug: "cedre", price: 46.99, description: "Arbre majestueux et durable.", image_urls: ["cedre1.jpg","cedre2.jpg"], stock: 1000, scientific_name: "Cedrus libani", carbon: 12.0 ,productLocations : [20]},
      { name: "Cyprès", slug: "cypres", price: 26.99, description: "Arbre élancé et résistant.", image_urls: ["cypres1.jpg","cypres2.jpg"], stock: 1000, scientific_name: "Cupressus sempervirens", carbon: 7.5 ,productLocations : [4, 5, 6, 9]},
      { name: "Sureau", slug: "sureau", price: 24.99, description: "Arbre ou arbuste aux fleurs odorantes.", image_urls: ["sureau1.jpg","sureau2.jpg"], stock: 1000, scientific_name: "Sambucus nigra", carbon: 6.9 ,productLocations : [12, 15]},
      { name: "Hêtre", slug: "hetre", price: 38.99, description: "Arbre aux feuilles larges et bois solide.", image_urls: ["hetre1.jpg","hetre2.jpg"], stock: 1000, scientific_name: "Fagus sylvatica", carbon: 9.8 ,productLocations : [16, 19]},
      { name: "Aulne", slug: "aulne", price: 25.99, description: "Arbre aimant l’humidité.", image_urls: ["aulne1.jpg","aulne2.jpg"], stock: 1000, scientific_name: "Alnus glutinosa", carbon: 7.0 ,productLocations : [18, 19]},
      { name: "Platane", slug: "platane", price: 33.99, description: "Arbre aux grandes feuilles lobées.", image_urls: ["platane1.jpg","platane2.jpg"], stock: 1000, scientific_name: "Platanus orientalis", carbon: 9.3 ,productLocations : [17, 20]},
      { name: "Robinier", slug: "robinier", price: 29.99, description: "Arbre aux fleurs jaunes et bois dur.", image_urls: ["robinier1.jpg","robinier2.jpg"], stock: 1000, scientific_name: "Robinia pseudoacacia", carbon: 8.2 ,productLocations : [5, 15]},
      { name: "Cerisier", slug: "cerisier", price: 36.99, description: "Arbre fruitier aux jolies fleurs.", image_urls: ["cerisier1.jpg","cerisier2.jpg"], stock: 1000, scientific_name: "Prunus avium", carbon: 10.0 ,productLocations : [11, 21]},
    ],
    skipDuplicates: true,
  });

  console.log("✅ Tous les produits");

  // ============================
  // Orders (10 commandes)
  // ============================


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