# Raccourcis pour la stack Docker. ENV choisit le fichier .env.<ENV>.
#   make dev                 # développement avec rechargement à chaud
#   make up ENV=staging      # stack « comme en prod » avec les images GHCR
#   make test                # tous les tests, hors Docker
ENV ?= development
ENV_FILE := .env.$(ENV)
COMPOSE := docker compose --env-file $(ENV_FILE) -f compose.yaml
COMPOSE_DEV := $(COMPOSE) -f compose.dev.yaml

.PHONY: help env dev up down logs ps pull build test test-backend test-web test-mobile test-sensors

help:
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-14s %s\n", $$1, $$2}'

$(ENV_FILE):
	@echo "$(ENV_FILE) absent : cp $(ENV_FILE).example $(ENV_FILE) puis renseignez-le." && exit 1

dev: $(ENV_FILE) ## lance la stack de dev (backend :3000, web :5173, db :5432)
	$(COMPOSE_DEV) up

up: $(ENV_FILE) ## lance la stack avec les images publiées (ENV=staging|production)
	$(COMPOSE) pull
	$(COMPOSE) up -d

build: $(ENV_FILE) ## construit les images en local
	$(COMPOSE) build

down: $(ENV_FILE) ## arrête la stack (les données de la base sont conservées)
	$(COMPOSE) down

logs: $(ENV_FILE) ## suit les logs
	$(COMPOSE) logs -f

ps: $(ENV_FILE) ## état des conteneurs
	$(COMPOSE) ps

test: test-backend test-web test-mobile test-sensors ## lance tous les tests

test-backend:
	cd apps/backend && npm ci && npm run lint && npm test && npm run test:e2e

test-web:
	cd apps/web && npm ci && npm run lint && npm test

test-mobile:
	cd apps/mobile && npm ci && npm run lint && npm run typecheck && npm test

test-sensors:
	cd apps/sensors && python3 -m venv .venv && .venv/bin/pip install -q -e '.[dev]' && .venv/bin/ruff check . && .venv/bin/pytest
