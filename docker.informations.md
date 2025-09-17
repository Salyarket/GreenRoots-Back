### Docker :

- docker compose up --build : build sans .env
  docker compose --env-file .env.docker up --build : build avec .env

- docker compose down -v --rmi all : supprime tout

- docker compose down → stoppe et supprime seulement les conteneurs du projet.

- docker compose down -v → supprime aussi les volumes (les données de la DB).

- docker rmi -f $(docker images -q) → supprime toutes les images de ta machine.

- docker system prune -a → supprime tout ce qui est inutile (conteneurs stoppés, images non utilisées, réseaux orphelins).

Garde DATABASE_URL=postgres://...@db:5432/... (Docker).

# Problème rencontré linux/windows

Pas de recharger sur windows avec le tsx -- watch (ne fonctionne que sur linux)
donc pour palier à ca, installation de nodemon sur windows avec config
legacyWatch dit à nodemon :
“N’utilise pas les événements système, mais vérifie régulièrement si les fichiers ont changé (polling)”.
C’est beaucoup plus compatible avec les volumes Docker sur Windows/Mac.
L’inconvénient : un peu plus de CPU, mais largement acceptable en dev. -->

nodemon.json : '''
{
"watch": ["./"],
"ext": "ts,json",
"ignore": ["node_modules", "dist"],
"exec": "tsx --env-file=.env ./index.ts",
"legacyWatch": true
}
'''
