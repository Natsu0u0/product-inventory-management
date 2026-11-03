# ==================
# 在庫情報の業務ロジック
# ==================

# 在庫一覧取得関数をインポート
from app.repositories.inventory_repository import (
    get_inventories as repository_get_inventories
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