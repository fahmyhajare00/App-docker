# Étape 1 : Build de l'application React
FROM node:20-alpine as build

WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm install

# Copier le reste du code source et compiler pour la production
COPY . .
RUN npm run build

# Étape 2 : Serveur web Nginx et Reverse Proxy
FROM nginx:alpine

# Copier la configuration personnalisée Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers compilés de React depuis l'étape 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
