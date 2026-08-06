import bcrypt

def gerar_hash_senha(senha: str) -> str:
    return bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()

def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    return bcrypt.checkpw(senha_plana.encode(), senha_hash.encode())