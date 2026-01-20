### A faire avant initilisation Prisma

VIA PSQL LINUX/OSX : sudo -i -u postgres psql
// Créer un utilisateur: CREATE USER greenroots WITH ENCRYPTED PASSWORD 'greenroots';
// Donner la permission à l'utilisateur de create une BDD : ALTER USER greenroots CREATEDB;
Comme ca via le schema.prisma on va pouvoir automatiquement créer la BDD greenroots

---

A partir de notre ModèlePhysiqueDeDonnées : create_tables.sql (create table User xxxxx pur sql )
Nous avons convertis le fichier sql en fichier Prisma : schema.prisma
Car prisma n'a pas la même syntaxte que du SQL pur. GPT a fait la conversion.
Cela va nous permettre à partir du "shema.prisma" de créer la BDD, générer la structure avec les tables et attributs et de pouvoir gérer les migrations lorsque nous souhaitons changer la BDD pour garder l'historique

---

# Etapes à suivre

En premier faire :
_npm run db:generate_ ( "db:generate": "prisma generate --schema=./src/models/schema.prisma",)
Prisma ne crée pas de nouveau dossier dans ton projet, ce qu’il fait c’est générer du code TypeScript/JavaScript dans node_modules/@prisma/client.
Concrètement ça veut dire : Dans ton projet tu n’auras pas de fichiers visibles générés.
Tout le code est compilé dans node_modules, car @prisma/client est la librairie que tu utilises pour interagir avec la base.

---

En deuxième faire :
_npm run db:migrate:dev_ ( "db:migrate:dev": "prisma migrate dev --schema=./src/models/schema.prisma --name auto" )
Ceci va créer le dossier migration, créer la BDD greenroots avec les tables et attributs. Si BDD existante, va venir écraser.

---

En troisième faire :
_npm run db:seed_ ("db:seed": "tsx --env-file=.env ./src/models/seeding.ts")
Ceci va nous permettre d'avoir des données à afficher

---

## Autres scrypts Prisma à connaitre

---

_npm run db:reset_ ("db:migrate:reset": "prisma migrate reset --force --schema=./src/models/schema.prisma")

Ceci va nous permettre de reset la BDD au niveau de son seedings

---

---

_npm run db:studio_ ("db:studio": "prisma studio --schema=./src/models/schema.prisma",)

Ceci va nous permettre d'afficher une interface pour affichier visuellement la BDD en ligne sur localhost:5555

---
