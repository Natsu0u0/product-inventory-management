# ==================
# 商品に関する業務処理
# ==================

# 商品Repositoryをインポート
from app.repositories.product_repository import (
    get_products as repository_get_products,
    create_product as repository_create_product,
    get_product as repository_get_product,
    update_product as repository_update_product,
    delete_product as repository_delete_product
)


# ==================
# 商品一覧取得
# ==================

# 商品一覧取得の業務処理
def get_products():
    return repository_get_products()


# ==================
# 商品詳細情報取得
# ==================

# 商品詳細情報取得の業務処理
def get_product(product_id):
    product = repository_get_product(product_id)

    # 商品情報が見つからない場合
    if product is None:
        return {"message": "指定された商品が見つかりません"}

    # 商品情報を返す
    return product


# ==================
# 各種登録
# ==================

# 各種登録の業務処理
def create_product(product, user_id):
    repository_create_product(product, user_id)
    return {"message": "商品が正常に登録されました"}


# ==================
# 商品更新
# ==================

# 商品更新の業務処理
def update_product(product_id, product, user_id):
    result = repository_update_product(product_id, product, user_id)

    # 更新対象が存在しない場合
    if result is False:
        return {"message": "指定された商品が見つかりません"}

    # 更新成功
    return {"message": "商品が正常に更新されました"}


# ==================
# 商品削除
# ==================

# 商品削除の業務処理
def delete_product(product_id):
    result = repository_delete_product(product_id)

    # 削除対象が存在しない場合
    if result is False:
        return {"message": "指定された商品が見つかりません"}

    # 削除成功
    return {"message": "商品が正常に削除されました"}