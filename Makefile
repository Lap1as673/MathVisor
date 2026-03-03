.PHONY: help build up down logs ps clean test lint format shell migrate

help:
	@echo "Available commands:"
	@echo "  make build    - Build all services"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - Show logs"
	@echo "  make ps       - Show running containers"
	@echo "  make clean    - Remove containers and volumes"
	@echo "  make test     - Run tests"
	@echo "  make lint     - Run linters"
	@echo "  make format   - Format code"
	@echo "  make migrate  - Run database migrations"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

ps:
	docker-compose ps

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

test:
	docker-compose exec auth-service pytest
	docker-compose exec graph-service pytest

lint:
	cd services/auth-service && black --check . && isort --check . && flake8
	cd services/frontend && npm run lint

format:
	cd services/auth-service && black . && isort .
	cd services/frontend && npm run format

migrate:
	docker-compose exec auth-service alembic upgrade head
	docker-compose exec forum-service alembic upgrade head

shell:
	docker-compose exec auth-service python manage.py shell

prod-build:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d