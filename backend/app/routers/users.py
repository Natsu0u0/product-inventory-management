# ==================
# APIの受付・リクエスト処理
# ==================
# FastAPIのAPIRouterをインポート
from fastapi import APIRouter

# ユーザサービスの関数をインポート
from app.services.user_service import get_user as service_get_user
from app.services.user_service import login as service_login

# ログイン時に受け取るデータのスキーマ
from app.schemas.user import UserLogin

#APIRouterのインスタンスを作成
router = APIRouter()

# ユーザ詳細取得API
@router.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user": service_get_user(user_id)}

# ログインAPI
@router.post("/login")
def login(user: UserLogin):
    return {"user": service_login(user.user_id, user.password)}