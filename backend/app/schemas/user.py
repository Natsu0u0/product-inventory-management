# ==================
# リクエストデータの定義・入力チェック
# ==================

# PydanticのBaseModelをインポート
from pydantic import BaseModel

# パスワードのハッシュ化・照合に使用
from pwdlib import PasswordHash

# パスワード照合用のインスタンスを作成
password_hash = PasswordHash.recommended()


# ログイン時に受け取るデータ
class UserLogin(BaseModel):
    user_id: int
    password: str