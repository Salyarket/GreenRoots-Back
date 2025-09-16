### Dictionnaire de notre librairie dans Package.json

_*dependencies:*_

- "express": framework API REST
- "@prisma/client": client pour accéder BDD

_*"devDependencies":*_

- "@eslint/js": règles de base d’ESLint pour JavaScript pur.
- @types/node + @types/express : types TS pour node/express
- "prisma": CLI pour générer le client, faire des mirations et gérer le schema
- "ts-node" : permet de lancer le code TS sans build (utile en dev)
- "tsx" : exécuteur TS pour lancer .ts avec Node.Js sans les compiler (gère type:module)
- "typescript": transpile code TS en JS
- "typescript-eslint": règles de base d’ESLint pour Typescript

  <!-- POUR PLUS TARD :
  dotenv → pour gérer les variables d’environnement
  winston → pour les logs
  zod ou joi → pour valider les entrées API (plus tard).
  jsonwebtoken → token
  bcrypt → hashage mdp + salage -->
