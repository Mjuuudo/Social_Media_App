FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY --from=ghcr.io/astral-sh/uv:0.13 /uv /bin/uv

RUN useradd -m -u 1000 app

WORKDIR /app

RUN chown app:app /app
USER app

COPY --chown=app:app pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project
ENV PATH="/app/.venv/bin:$PATH"
COPY --chown=app:app . . 


EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


