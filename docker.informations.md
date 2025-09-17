<!-- docker exec -it greenroots-backend-1 sh -->

<!--
docker compose up --build : build sans .env
docker compose --env-file .env.docker up --build : build avec .env

docker compose down -v --rmi all : supprime tout

docker compose down → stoppe et supprime seulement les conteneurs du projet.

docker compose down -v → supprime aussi les volumes (les données de la DB).

docker rmi -f $(docker images -q) → supprime toutes les images de ta machine.

docker system prune -a → supprime tout ce qui est inutile (conteneurs stoppés, images non utilisées, réseaux orphelins).




Garde DATABASE_URL=postgres://...@db:5432/... (Docker).

Tous tes npm run db:... doivent être exécutés dans le conteneur backend (docker compose exec backend ...).

🔍 Ce qui se passait avant

// Sur ton Windows + Docker, ton code local est monté dans le conteneur avec un volume partagé (./GreenRoots_Backend:/app).

// Les outils comme nodemon ou tsx --watch utilisent par défaut les événements système de fichiers (inotify sur Linux) pour détecter les changements.

// Problème : quand les fichiers viennent d’un volume Windows ↔ Linux (via Docker Desktop), ces événements ne passent pas correctement.
// 👉 Résultat : nodemon ne voyait aucune modification dans ton conteneur.
Ce que fait legacyWatch: true

legacyWatch dit à nodemon :

“N’utilise pas les événements système, mais vérifie régulièrement si les fichiers ont changé (polling)”.

C’est beaucoup plus compatible avec les volumes Docker sur Windows/Mac.

L’inconvénient : un peu plus de CPU, mais largement acceptable en dev. -->

<!-- {
  "watch": ["./"],
  "ext": "ts,json",
  "ignore": ["node_modules", "dist"],
  "exec": "tsx --env-file=.env ./index.ts",
  "legacyWatch": true
} -->
