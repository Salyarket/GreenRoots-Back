### GreenRoots Backend

## INITIALIZATION

!!!OPEN YOUR DOCKER APPLICATION ON YOUR COMPUTER!!!

1. Option 1 : **Linux/WSL/OSX**:
   Nothing to do. Option by default  


2. Option 2 : **Windows + (Docker Desktop)**:
   We need to override the default linux option.
   So you have to create a new file at the root of the folder :

   - a file `docker-compose.override.yml` with:

   content :

   ```yaml
   services:
   backend:
   command: npm run dev:win
   ```

3. Start everything in a terminal with:
   - if you are using linux :
    - donner droit : chmod +x ./init.sh
    - puis  ./init.sh : 
   - if you are using windows : ./init.bat

---

## INITIALIZATION LOCAL IF YOU WORK OUT OF DOCKER (ALSO RECOMMENDED)

- 1 : Open terminal and type : npm i
- 2 : create a new .env and copy paste informations from .env.example

## Database PostreSQL + Prisma

- 1 : sudo -i -u postgres psql
- 2 : CREATE USER greenroots WITH ENCRYPTED PASSWORD 'greenroots';
- 3 : ALTER USER greenroots CREATEDB;
- 4 : _npm run db:generate_ (init client in node_modules)
- 5 : _npm run db:migrate:dev_ (init migrations folder + create DB...)
- 6 : _npm run db:seed_ (add the seeding to the database)
- 7 : _npm run db:studio_ (open a visual from prisma studio )

---
