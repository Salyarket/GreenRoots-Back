# Image de base
FROM node:22-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code (optionnel en dev car on va monter un volume)
COPY . .

# Exposer le port de ton backend (par ex. 4000 ou 3000 selon ton app)
EXPOSE 4000

# Commande par défaut → lance ton serveur en mode dev
CMD ["npm", "run", "dev"]
