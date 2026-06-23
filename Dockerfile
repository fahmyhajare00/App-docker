# Image de base
FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Port utilisé par l'app
EXPOSE 4000

# Commande pour lancer l'app
CMD ["node", "index.js"]