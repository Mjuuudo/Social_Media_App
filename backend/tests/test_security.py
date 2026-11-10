from app.security import hash_password , verify_password


def test_correct_password_is_accepted():
    password_hash= hash_password("Secret123")
    assert verify_password("Secret123",password_hash) is True

def test_access_token_round_trip():
    from app.security import create_access_token, decode_access_token

    assert decode_access_token(create_access_token(42)) == 42


def test_tampered_token_is_rejected():
    from app.security import create_access_token, decode_access_token

    assert decode_access_token(create_access_token(42) + "x") is None
