
# ==================
# 販売先情報の処理
# ==================

## 販売先Repositoryをインポート
from app.repositories.customer_repository import (
    get_customers as repository_get_customers,
    create_customer as repository_create_customer,
    update_customer as repository_update_customer,
    delete_customer as repository_delete_customer
)


# ==================
# 販売先一覧取得
# ==================

def get_customers():
    return repository_get_customers()


# ==================
# 販売先マスタ登録
# ==================

def create_customer(customer, user_id):
    repository_create_customer(customer, user_id)
    return "販売先を登録しました。"


# ==================
# 販売先マスタ更新
# ==================

def update_customer(customer_id, customer, user_id):
    result = repository_update_customer(customer_id, customer, user_id)

    if not result:
        raise ValueError("指定された販売先が存在しません。")

    return "販売先を更新しました。"


# ==================
# 販売先マスタ削除
# ==================

def delete_customer(customer_id):
    result = repository_delete_customer(customer_id)

    if not result:
        raise ValueError("指定された販売先が存在しません。")

    return "販売先を削除しました。"
