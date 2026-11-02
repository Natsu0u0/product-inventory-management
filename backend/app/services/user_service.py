# ==================
# ユーザに関する業務処理
# ==================

# ユーザ情報取得のリポジトリをインポート
from app.repositories.user_repository import get_user as repository_get_user

# パスワードのハッシュ化・照合に使用
from pwdlib import PasswordHash

# パスワード照合用のインスタンスを作成
password_hash = PasswordHash.recommended()

# ==================
# ユーザ詳細情報取得
# ==================

# ユーザ詳細情報取得の業務処理
def get_user(user_id):
    user = repository_get_user(user_id)

    # ユーザ情報が見つからない場合
    if user is None:
        return {"message": "指定されたユーザが見つかりません"}

    # ユーザ情報を返す
    return user


# ==================
# ログイン処理
# ==================

# ログインの業務処理
def login(user_id, password):
    user = repository_get_user(user_id)

    # ユーザ情報が見つからない場合
    if user is None:
        return {"message": "ユーザIDまたはパスワードが違います"}

    # パスワードを照合
    if not password_hash.verify(password, user["password_hash"]):
        return {"message": "ユーザIDまたはパスワードが違います"}

    # ログイン成功
    return {"message": "ログイン成功"}