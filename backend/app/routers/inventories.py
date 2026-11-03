from fastapi import APIRouter

from app.services.inventory_service import (
    get_inventories as service_get_inventories
)

router = APIRouter()


# ==================
# 在庫一覧取得
# ==================
@router.get("/inventories")
def get_inventories():
    return {
        "inventories": service_get_inventories()
    }