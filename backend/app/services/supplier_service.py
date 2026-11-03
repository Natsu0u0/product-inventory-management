
# ==================
# 仕入先情報の処理
# ==================

# 仕入先Repositoryをインポート
from app.repositories.supplier_repository import (
    get_suppliers as repository_get_suppliers,
    create_supplier as repository_create_supplier,
    update_supplier as repository_update_supplier,
    delete_supplier as repository_delete_supplier
)


# ==================
# 仕入先一覧取得
# ==================

def get_suppliers():
    return repository_get_suppliers()


# ==================
# 仕入先マスタ登録
# ==================

def create_supplier(supplier, user_id):
    repository_create_supplier(supplier, user_id)
    return "仕入先を登録しました。"


# ==================
# 仕入先マスタ更新
# ==================

def update_supplier(supplier_id, supplier, user_id):
    result = repository_update_supplier(supplier_id, supplier, user_id)

    if not result:
        raise ValueError("指定された仕入先が存在しません。")

    return "仕入先を更新しました。"


# ==================
# 仕入先マスタ削除
# ==================

def delete_supplier(supplier_id):
    result = repository_delete_supplier(supplier_id)

    if not result:
        raise ValueError("指定された仕入先が存在しません。")

    return "仕入先を削除しました。"
