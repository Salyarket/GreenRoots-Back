echo "🚀 Arrêt et suppression des conteneurs et volumes existants..."
docker compose down -v

echo "🔥 Reconstruction et démarrage des conteneurs (db + backend)..."
docker compose up --build -d db backend

echo "📦 Réinstallation des dépendances..."
docker compose exec backend npm install

echo "🛠️ Génération du client Prisma..."
docker compose exec backend npm run db:generate

echo "🗄️ Migration de la base de données..."
docker compose exec backend npm run db:migrate:dev

echo "🌱 Seeding de la base de données..."
docker compose exec backend npm run db:seed

echo "🚀 Lancement complet avec Adminer..."
docker compose up