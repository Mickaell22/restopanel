# syntax=docker/dockerfile:1

# --- build: Angular compila a estaticos, node no hace falta en runtime ---
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime: Caddy sirviendo el bundle (~50 MB de imagen, sin node) ---
FROM caddy:2-alpine AS runtime
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist/restopanel/browser /srv
EXPOSE 8080
