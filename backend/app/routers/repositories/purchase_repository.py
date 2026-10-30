# ==================
# 仕入履歴のデータベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection

# 接続とカーソルを閉じるために使用
from contextlib import closing

# 商品情報取得関数をインポート
from app.repositories.product_repository import get_product_category

# 仕入先情報取得関数をインポート
from app.repositories.supplier_repository import get_supplier

# 在庫操作関数をインポート
from app.repositories.inventory_repository import (
    get_inventory_for_update,
    create_inventory,
    add_inventory_quantity
)


# ==================
# 在庫管理に商品が存在しているか確認
# ==================

# 在庫レコードの存在確認
def exists_inventory(product_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 在庫レコードの存在確認
            cursor.execute(
                """
                ## 在庫レコードの存在確認
                SELECT EXISTS (
                    SELECT 1
                    FROM inventories
                    WHERE product_id = %s
                )
                """,
                (product_id,)
            )
            # 取得した1行を受け取る
            result = cursor.fetchone()
            return result[0]


# ==================
# ステータス新規or追加：仕入履歴登録・在庫登録or更新
# ==================

# 仕入履歴を登録する
def create_purchase_history(history):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:

            # 仕入先名を取得
            supplier_name = get_supplier(history.supplier_id)

            # 商品カテゴリを取得
            category = get_product_category(history.product_id)

            # 仕入履歴を登録
            cursor.execute(
                """
                ### 仕入履歴を登録
                INSERT INTO purchase_history (
                    supplier_id,
                    product_id,
                    status,
                    purchase_quantity,
                    notes,
                    supplier_name,
                    category,
                    created_at,
                    created_by
                )
                ### 登録する値
                VALUES (
                    %s, %s, DEFAULT, %s, %s, %s, %s,
                    CURRENT_DATE, %s
                )
                """,
                (
                    history.supplier_id,
                    history.product_id,
                    history.purchase_quantity,
                    history.notes,
                    supplier_name,
                    category,
                    0
                )
            )

            # 対象商品の在庫を取得してロック
            inventory = get_inventory_for_update(
                cursor,
                history.product_id
            )

            # 在庫レコードが存在しない場合は新規登録
            if inventory is None:
                create_inventory(
                    cursor,
                    history.product_id,
                    history.purchase_quantity
                )

            # 在庫レコードが存在する場合は数量を加算
            else:
                add_inventory_quantity(
                    cursor,
                    history.product_id,
                    history.purchase_quantity
                )

            # 履歴登録と在庫登録or更新をまとめて確定
            conn.commit()


# ==================
# ステータス修正orキャンセル：仕入履歴更新・在庫更新
# ==================

# 仕入履歴を更新する
def update_purchase_history(history):
    # DBに接続
        with closing(get_connection()) as conn:
            # SQLを操作するカーソルを作成
            with closing(conn.cursor()) as cursor:
                # 仕入履歴を更新
                cursor.execute(
                    """
                    ### 仕入履歴を更新
                    UPDATE purchase_history
                    SET status = %s,
                        purchase_quantity = %s,
                        notes = %s,
                        updated_at = CURRENT_DATE,
                        updated_by = %s
                    WHERE history_id = %s
                    """,
                    (
                        history.status,
                        history.purchase_quantity,
                        history.notes,
                        0,
                        history.history_id
                    )
                )

                # 対象商品の在庫を取得してロック
                inventory = get_inventory_for_update(
                    cursor,
                    history.product_id
                )

                # 在庫レコードが存在する場合は数量を加算
                if inventory is not None:
                    if history.status == "修正":
                        # 修正前後の仕入数量の差分を計算
                        quantity_difference = (history.purchase_quantity - history.previous_purchase_quantity)
                    elif history.status == "キャンセル":
                        # キャンセル前の仕入数量を在庫から減算
                        quantity_difference = 0 - history.previous_purchase_quantity

                    # 在庫数量を更新
                    add_inventory_quantity(
                        cursor,
                        history.product_id,
                        quantity_difference)

                # 履歴更新と在庫更新をまとめて確定
                conn.commit()
    