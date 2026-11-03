# ==================
# 販売履歴の業務ロジック
# ==================

# 販売履歴Repositoryをインポート
from app.repositories.sales_repository import (
    get_sales_histories as repository_get_sales_histories,
    create_sales_history as repository_create_sales_history,
    update_sales_history as repository_update_sales_history,
    cancel_sales_history as repository_cancel_sales_history
)


# ==================
# 販売履歴登録・更新
# ==================

# 販売履歴を登録・更新する
def create_sales_history(history, user_id):

    # ステータスを取得
    status = history.status

    # ステータスが新規または追加の場合
    if status == "新規" or status == "追加":

        # 販売履歴を登録
        repository_create_sales_history(history, user_id)

        return "販売履歴を登録しました。"

    # ステータスが修正の場合
    elif status == "修正":

        # 販売履歴を更新
        repository_update_sales_history(history, user_id)

        return "販売履歴を修正しました。"

    else:
        raise ValueError("指定されたステータスは登録・更新できません。")


# ==================
# 販売履歴一覧取得
# ==================

# 販売履歴一覧を取得する
def get_sales_histories():
    # 販売履歴一覧を取得
    sales_histories = repository_get_sales_histories()

    # タプル形式のデータを辞書形式に変換
    result = []

    for history in sales_histories:
        result.append({
            "sales_id": history[0],
            "customer_id": history[1],
            "product_id": history[2],
            "product_name": history[3],
            "category": history[4],
            "status": history[5],
            "sales_quantity": history[6],
            "notes": history[7],
            "created_at": history[8],
            "customer_name": history[9]
        })

    return result


# ==================
# 販売履歴のキャンセル処理
# ==================

# 販売履歴をキャンセルする
def cancel_sales_history(sales_id, user_id):
    repository_cancel_sales_history(sales_id, user_id)

    return "販売履歴をキャンセルしました。"