from httpx import ASGITransport, AsyncClient

from app.main import app


async def test_register_rejects_short_username():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/auth/register",
            json={"username": "ka", "email": "a@b.com", "password": "12345678"},
        )

    assert response.status_code == 422