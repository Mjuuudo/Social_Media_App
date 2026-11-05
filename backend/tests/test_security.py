from app.security import hash_password , verify_password


def test_correct_password_is_accepted():
    password_hash= hash_password("Secret123")
    assert verify_password("Secret123",password_hash) is True