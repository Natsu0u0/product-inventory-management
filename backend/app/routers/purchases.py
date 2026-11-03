# ==================
# 仕入履歴のAPIルート
# ==================

from fastapi import APIRouter

# 仕入履歴の業務ロジックをインポート
from app.services.purchase_service import (
    get_purchase_histories as service_get_purchase_histories,
    create_purchase_history as service_create_purchase_history
)

# 仕入履歴の入力スキーマをインポート
from app.schemas.product import PurchaseCreate, PurchaseUpdate


router = APIRouter()


# ==================
# 仕入履歴一覧取得
# ==================

@router.get("/purchase/history")
def get_purchase_histories():
    return {
        "purchase_histories": service_get_purchase_histories()
    }


# ==================
# 仕入履歴登録・更新
# ==================

@router.post("/purchase/history")
def create_purchase_history(history: PurchaseCreate | PurchaseUpdate, user_id: int):
    return service_create_purchase_history(history, user_id)