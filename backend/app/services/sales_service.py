
# ==================
# 販売履歴の業務ロジック
# ==================

# 販売履歴Repositoryをインポート
from app.repositories.sales_repository import (
    get_sales_histories as repository_get_sales_histories,
    create_sales_history as repository_create_sales_history,
    update_sales_history as repository_update_sales_history
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

    # ステータスが修正またはキャンセルの場合
    elif status == "修正" or status == "キャンセル":

        # 販売履歴を更新
        repository_update_sales_history(history, user_id)

        return "販売履歴を更新しました。"

    else:
        raise ValueError("指定されたステータスは登録・更新できません。")


# ==================
# 販売履歴一覧取得
# ==================

# 販売履歴一覧を取得する
def get_sales_histories():
    # 販売履歴一覧を取得
    sales_histories = repository_get_sales_histories()

    return sales_histories
