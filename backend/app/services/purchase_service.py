
# ==================
# 仕入履歴に関する業務処理
# ==================

# 仕入Repositoryをインポート
from app.repositories.purchase_repository import (
    get_purchase_histories as repository_get_purchase_histories,
    exists_inventory as repository_exists_inventory,
    create_purchase_history as repository_create_purchase_history,
    update_purchase_history as repository_update_purchase_history
)

# 仕入履歴の登録・更新処理
def create_purchase_history(history, user_id):
    status = history.status

    # 新規・追加の場合
    if status == "新規" or status == "追加":
        repository_create_purchase_history(history, user_id)
        return "仕入履歴を登録しました。"

    # 修正・キャンセルの場合
    elif status == "修正" or status == "キャンセル":
        repository_update_purchase_history(history, user_id)
        return "仕入履歴を更新しました。"

    else:
        raise ValueError("指定されたステータスは登録・更新できません。")


# ==================
# 仕入履歴一覧取得
# ==================

# 仕入履歴一覧を取得する
def get_purchase_histories():
    # 仕入履歴一覧を取得
    purchase_histories = repository_get_purchase_histories()

    return purchase_histories