### Docker

_1_: Docker commandes

- build sans avoir de .env : "docker compose up --build"

- build avec un .env : "docker compose --env-file .env.docker up --build"

- tout supprimer conteneurs+images : "docker compose down -v --rmi all"

- supprime les conteneurs du projet : "docker compose down"

- supprime conteneur + DataBase : "docker compose down -v"


- se connecter a docker sur le conteneur backend pour donner des scripts :
  - ex : "docker compose exec backend npm run db:migrate:dev "
  - ex : "docker compose exec backend npm run db:reset "
  - ex : "docker compose exec backend npm run db:migrate:dev "
  - ex : "docker compose exec backend npm run db:seed "

# Problèmes rencontrés linux/windows

Pas de "recharger" sur windows avec le tsx -- watch (ne fonctionne que sur linux)
donc pour palier à ca, installation de nodemon sur windows avec config
legacyWatch dit à nodemon :
“N’utilise pas les événements système, mais vérifie régulièrement si les fichiers ont changé (polling)”.
C’est bien plus compatible avec les volumes Docker sur Windows/Mac.
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
