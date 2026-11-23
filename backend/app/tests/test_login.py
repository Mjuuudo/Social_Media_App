from httpx import ASGITransport, AsyncClient

from app.main import app


async def test_login_works():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/login", json={"identifier": "abait-ou", "password": "lezaraki/0"}
        )

    assert response.status_code == 200
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/login", json={"identifier": "abait-ou", "password": "lezraki/0"}
        )

    assert response.status_code == 401
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/login", json={"identifier": "aait-ou", "password": "lezaraki/0"}
        )

    assert response.status_code == 401
