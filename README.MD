### GreenRoots Backend

## Initialisation

1.  !!!OUVRIR VOTRE DOCKER APPLICATION!!!
2.  Tapper dans le terminal pour supprimer les anciennes images/conteneurs : "docker compose down -v --rmi all"
3.  créer un .env à la racine du projet et copier-coller à partir de .env.example

4.  Option 1 : **Linux/WSL/OSX**:
    Rien à faire. Option par défault.

    Option 2 : **Windows + (Docker Desktop)**:
    Si vous utilisez windows on doit forcer l'utilisation de nodemon + polling
    Vous devez créer à la racine du projet un nouveau FICHIER `docker-compose.override.yml` :

        contenu (ne pas copier les guillemets "") :
        "
        services:
        backend:
        command: npm run dev:win
        "

5.  Ouvrir un terminal et tappez :
    Option 1 : - si vous utilisez LINUX/OSX/WSL : - tappez : "chmod +x ./init.sh" puis tappez "./init.sh"
    Option 2 : - si vous utilisez WINDOWS : - tappez : "./init.bat"

---

## INITIALISAION EN LOCAL (HORS DOCKER) ==> AUSSI RECOMMENDÉ

- 1 : Ouvrir un terminal et tappez : "npm i"
- 2 : crée un .env à la racine du projet si ce n'est pas déjà fait et copier-coller le .env.example

## PostreSQL + Prisma initialisation

- 1 : ouvrir un terminal et tappez : "sudo -i -u postgres psql"
- 2 : CREATE USER greenroots WITH ENCRYPTED PASSWORD 'greenroots';
- 3 : ALTER USER greenroots CREATEDB;
- 4 : _npm run db:generate_ (init client in node_modules)
- 5 : _npm run db:migrate:dev_ (init migrations folder + create DB...)
- 6 : _npm run db:seed_ (add the seeding to the database)
- 7 : _npm run db:studio_ (open a visual from prisma studio )

---
