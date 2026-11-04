# ==================
# 在庫情報の業務ロジック
# ==================

# 在庫一覧取得関数をインポート
from app.repositories.inventory_repository import (
    get_inventories as repository_get_inventories,
    delete_inventory as repository_delete_inventory
)


# ==================
# 在庫一覧取得
# ==================

# 在庫一覧を取得する
def get_inventories():

    # 在庫一覧を取得
    inventories = repository_get_inventories()

    # 在庫一覧を返す
    return inventories


# ==================
# 在庫データ削除
# ==================

def delete_inventory(inventory_id):

    result = repository_delete_inventory(inventory_id)

    if result == "not_found":
        return {
            "success": False,
            "message": "対象の在庫データが存在しません。"
        }

    if result == "stock_exists":
        return {
            "success": False,
            "message": "在庫が残っているため削除できません。"
        }

    return {
        "success": True,
        "message": "在庫データを削除しました。"
    }