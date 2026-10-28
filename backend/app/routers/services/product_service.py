# ==================
# 商品に関する業務処理
# ==================

# 商品Repositoryをインポート
from app.repositories.product_repository import get_products as repository_get_products
from app.repositories.product_repository import create_product as repository_create_product


# 商品一覧取得の業務処理
def get_products():
    return repository_get_products()


# 商品登録の業務処理
def create_product(product):
    repository_create_product(product)
    return {"message": "商品が正常に登録されました"}