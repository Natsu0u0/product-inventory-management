from fastapi import APIRouter, HTTPException

from app.services.inventory_service import (
    get_inventories as service_get_inventories,
    delete_inventory as service_delete_inventory
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


# ==================
# 在庫データ削除
# ==================
@router.delete("/inventories/{inventory_id}")
def delete_inventory(inventory_id: int):

    result = service_delete_inventory(inventory_id)

    if not result["success"]:
        status_code = (
            400 if "在庫が残っている" in result["message"]
            else 404
        )

        raise HTTPException(
            status_code=status_code,
            detail=result["message"]
        )

    return result