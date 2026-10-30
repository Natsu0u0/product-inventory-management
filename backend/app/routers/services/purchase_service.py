# ==================
# 仕入履歴に関する業務処理
# ==================

# 仕入Repositoryをインポート
from app.repositories.purchase_repository import exists_inventory as repository_exists_inventory
from app.repositories.purchase_repository import create_purchase_history as repository_create_purchase_history
from app.repositories.purchase_repository import update_purchase_history as repository_update_purchase_history


# 仕入履歴の登録・更新処理
def create_purchase_history(history):
    status = "画面から送られてくるステータス"

    # 新規・追加の場合
    if status == "新規" or status == "追加":
        repository_create_purchase_history(history)
        return "仕入履歴を登録しました。"

    # 修正・キャンセルの場合
    elif status == "修正" or status == "キャンセル":
        repository_update_purchase_history(history)
        return "仕入履歴を更新しました。"