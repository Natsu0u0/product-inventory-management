
# ==================
# APIの受付・リクエスト処理
# ==================

# FastAPIのAPIRouterをインポート
from fastapi import APIRouter

# Serviceをインポート
from app.services.product_service import get_products as service_get_products
from app.services.product_service import create_product as service_create_product
from app.services.product_service import get_product as service_get_product
from app.services.product_service import update_product as service_update_product
from app.services.product_service import delete_product as service_delete_product

# 各種登録用のデータ形式をインポート
from app.schemas.product import ProductCreate, ProductUpdate


# 商品API用のRouterを作成
router = APIRouter()


# 商品一覧取得API
@router.get("/products")
def get_products():
    return {"products": service_get_products()}


# 各種登録API
@router.post("/products")
def create_product(product: ProductCreate, user_id: int):
    return service_create_product(product, user_id)


# 商品詳細取得API
@router.get("/products/{product_id}")
def get_product(product_id: int):
    return {"product": service_get_product(product_id)}


# 商品更新API
@router.put("/products/{product_id}")
def put_product(product_id: int, product: ProductUpdate, user_id: int):
    return service_update_product(product_id, product, user_id)


# 商品削除API
@router.delete("/products/{product_id}")
def delete_product(product_id: int):
    return service_delete_product(product_id)
