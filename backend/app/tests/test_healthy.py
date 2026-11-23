from httpx import ASGITransport, AsyncClient

from app.main import app


async def test_root_says_hello():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")

    assert response.status_code == 200
    assert response.json() == {"hello": "world"}
