up:
	docker compose up
down:
	docker compose down
restart:
	docker compose down && docker compose up
erease:
	docker compose down -v
fresh:
	docker compose up --build
