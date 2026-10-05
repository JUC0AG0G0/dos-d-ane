# syntax=docker/dockerfile:1

# --- Compilation de l'application React ---
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Service des fichiers statiques et proxy /api par nginx ---
FROM nginx:1.29-alpine AS runtime
# Adresse du backend vue depuis le conteneur web (surchargée par compose).
ENV API_UPSTREAM=http://backend:3000
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
