
# ==================
# 販売先情報のAPIルーター
# ==================

from fastapi import APIRouter

# 販売先情報のサービスをインポート
from app.services.customer_service import (
    get_customers as service_get_customers,
    create_customer as service_create_customer,
    update_customer as service_update_customer,
    delete_customer as service_delete_customer
)

from app.schemas.product import CustomerCreate, CustomerUpdate


router = APIRouter()


# ==================
# 販売先一覧取得
# ==================

@router.get("/customers")
def get_customers():
    return {
        "customers": service_get_customers()
    }


# ==================
# 販売先マスタ登録
# ==================

@router.post("/customers")
def create_customer(customer: CustomerCreate, user_id: int):
    return service_create_customer(customer, user_id)


# ==================
# 販売先マスタ更新
# ==================

@router.put("/customers/{customer_id}")
def update_customer(customer_id: int, customer: CustomerUpdate, user_id: int):
    return service_update_customer(customer_id, customer, user_id)


# ==================
# 販売先マスタ削除
# ==================

@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int):
    return service_delete_customer(customer_id)
