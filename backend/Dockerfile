FROM python:3.14-slim

# Install uv by copying the static binary from the official image
COPY --from=ghcr.io/astral-sh/uv:0.13 /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    # Keep the venv OUTSIDE /app so the ./backend:/app bind mount can't hide it
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH"

RUN useradd -m -u 1000 appuser \
    && mkdir -p /app /opt/venv \
    && chown -R appuser:appuser /app /opt/venv
WORKDIR /app
USER appuser

# Install dependencies first (cached layer, only rebuilt when the lock changes)
COPY --chown=appuser:appuser pyproject.toml uv.lock .python-version ./
RUN uv sync --frozen --no-install-project

# Copy the code and install the project itself
COPY --chown=appuser:appuser . .
RUN uv sync --frozen

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
