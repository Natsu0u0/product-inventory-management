
# ==================
# 仕入履歴に関する業務処理
# ==================

# 仕入Repositoryをインポート
from app.repositories.purchase_repository import (
    get_purchase_histories as repository_get_purchase_histories,
    exists_inventory as repository_exists_inventory,
    create_purchase_history as repository_create_purchase_history,
    update_purchase_history as repository_update_purchase_history,
    cancel_purchase_history as repository_cancel_purchase_history
)

# 仕入履歴の登録・更新処理
def create_purchase_history(history, user_id):
    status = history.status

    # 新規・追加の場合
    if status == "新規" or status == "追加":
        repository_create_purchase_history(history, user_id)
        return "仕入履歴を登録しました。"

    # 修正の場合
    elif status == "修正":
        repository_update_purchase_history(history, user_id)
        return "仕入履歴を修正しました。"

    else:
        raise ValueError("指定されたステータスは登録・更新できません。")


# 仕入履歴一覧を取得する
def get_purchase_histories():
    # 仕入履歴一覧を取得
    purchase_histories = repository_get_purchase_histories()

    # タプル形式のデータを辞書形式に変換
    result = []

    for history in purchase_histories:
        result.append({
            "purchase_id": history[0],
            "supplier_id": history[1],
            "product_id": history[2],
            "product_name": history[3],
            "category": history[4],
            "status": history[5],
            "purchase_quantity": history[6],
            "notes": history[7],
            "created_at": history[8],
            "supplier_name": history[9]
        })

    return result

# 仕入履歴のキャンセル処理
def cancel_purchase_history(purchase_id, user_id):
    repository_cancel_purchase_history(purchase_id, user_id)
    return "仕入履歴をキャンセルしました。"