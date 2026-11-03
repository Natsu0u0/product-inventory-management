
# ==================
# 仕入先情報のAPIルーター
# ==================

from fastapi import APIRouter

#仕入先情報のサービスをインポート
from app.services.supplier_service import (
    get_suppliers as service_get_suppliers,
    create_supplier as service_create_supplier,
    update_supplier as service_update_supplier,
    delete_supplier as service_delete_supplier
)
from app.schemas.product import SupplierCreate, SupplierUpdate


router = APIRouter()


# ==================
# 仕入先一覧取得
# ==================

@router.get("/suppliers")
def get_suppliers():
    return {"suppliers": service_get_suppliers()}


# ==================
# 仕入先マスタ登録
# ==================

@router.post("/suppliers")
def create_supplier(supplier: SupplierCreate, user_id: int):
    return service_create_supplier(supplier, user_id)


# ==================
# 仕入先マスタ更新
# ==================

@router.put("/suppliers/{supplier_id}")
def update_supplier(supplier_id: int, supplier: SupplierUpdate, user_id: int):
    return service_update_supplier(supplier_id, supplier, user_id)


# ==================
# 仕入先マスタ削除
# ==================

@router.delete("/suppliers/{supplier_id}")
def delete_supplier(supplier_id: int):
    return service_delete_supplier(supplier_id)
