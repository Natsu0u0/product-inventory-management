# ==================
# 仕入履歴のAPIルート
# ==================

from fastapi import APIRouter
from app.services.purchase_service import (
    get_purchase_histories as service_get_purchase_histories,
    create_purchase_history as service_create_purchase_history,
    cancel_purchase_history as service_cancel_purchase_history
)
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
def create_purchase_history(history: dict, user_id: int):

    # purchase_idの有無によって登録用・更新用のスキーマを切り替える
    if "purchase_id" in history:
        validated_history = PurchaseUpdate.model_validate(history)
    else:
        validated_history = PurchaseCreate.model_validate(history)

    return service_create_purchase_history(validated_history, user_id)


# ==================
# 仕入履歴キャンセル
# ==================

@router.post("/purchase/history/{purchase_id}/cancel")
def cancel_purchase_history(purchase_id: int, user_id: int):
    return service_cancel_purchase_history(purchase_id, user_id)