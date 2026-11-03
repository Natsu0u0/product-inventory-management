# ==================
# 販売履歴のAPIルート
# ==================

from fastapi import APIRouter

# 販売履歴の業務ロジックをインポート
from app.services.sales_service import (
    get_sales_histories as service_get_sales_histories,
    create_sales_history as service_create_sales_history
)

# 販売履歴の入力スキーマをインポート
from app.schemas.product import SalesCreate, SalesUpdate


router = APIRouter()


# ==================
# 販売履歴一覧取得
# ==================

@router.get("/sales/history")
def get_sales_histories():
    return {
        "sales_histories": service_get_sales_histories()
    }


# ==================
# 販売履歴登録・更新
# ==================

@router.post("/sales/history")
def create_sales_history(history: SalesCreate | SalesUpdate, user_id: int):
    return service_create_sales_history(history, user_id)