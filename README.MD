### GreenRoots Backend

## Initialization

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

