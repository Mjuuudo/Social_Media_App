from httpx import ASGITransport, AsyncClient

from app.main import app


async def test_login_rejects_missing_password():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/auth/login", json={"login": "someone"})

    assert response.status_code == 422


async def test_list_users_requires_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/users")

    assert response.status_code == 401
