# ==================
# APIの受付・リクエスト処理
# ==================

# FastAPIのAPIRouterをインポート
from fastapi import APIRouter

# Serviceをインポート
from app.services.product_service import get_products as service_get_products
from app.services.product_service import create_product as service_create_product

# 商品登録用のデータ形式をインポート
from app.schemas.product import ProductCreate


# 商品API用のRouterを作成
router = APIRouter()


# 商品一覧取得API
@router.get("/products")
def get_products():
    return {"products": service_get_products()}


# 商品登録API
@router.post("/products")
def create_product(product: ProductCreate):
    return service_create_product(product)