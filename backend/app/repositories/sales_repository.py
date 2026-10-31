
# ==================
# 販売履歴のデータベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection

# 接続とカーソルを閉じるために使用
from contextlib import closing

# 商品情報取得関数をインポート
from app.repositories.product_repository import get_product_category

# 販売先情報取得関数をインポート
from app.repositories.customer_repository import get_customer

# 在庫操作関数をインポート
from app.repositories.inventory_repository import (
    get_inventory_for_update,
    add_inventory_quantity
)


# ==================
# 販売履歴の情報を取得
# ==================

# 販売履歴レコードの存在確認
def get_sales_history(cursor, sales_id):
    # 販売履歴レコードの存在確認
    cursor.execute(
        """
        SELECT status, sales_quantity, product_id
        FROM sales_history
        WHERE sales_id = %s
        """,
        (sales_id,)
    )

    # 取得した結果1行を受け取る
    sales_history_data = cursor.fetchone()

    # sales_history_dataがNoneの場合はNoneを返す
    if sales_history_data is None:
        return None, None, None

    # sales_history_dataがNoneでない場合は情報を返す
    else:
        return (
            sales_history_data[0],
            sales_history_data[1],
            sales_history_data[2]
        )


# ==================
# ステータス新規or追加：販売履歴登録・在庫更新
# ==================

# 販売履歴を登録する
def create_sales_history(history):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:

            # 販売数量が0以下の場合はエラー
            if history.sales_quantity <= 0:
                raise ValueError("入力値エラー。")

            # 販売先名を取得
            customer_name = get_customer(history.customer_id)

            # 商品カテゴリを取得
            category = get_product_category(history.product_id)

            # 対象商品の在庫を取得してDBロック
            inventory = get_inventory_for_update(
                cursor,
                history.product_id
            )

            # 在庫レコードが存在しない場合はエラー
            if inventory is None:
                raise ValueError("在庫レコードが存在しません。")

            # 販売数量が在庫数量を超える場合はエラー
            stock_quantity = inventory[1]
            if history.sales_quantity > stock_quantity:
                raise ValueError("在庫数量が不足しています。")

            # 販売履歴を登録
            cursor.execute(
                """
                INSERT INTO sales_history (
                    customer_id,
                    product_id,
                    status,
                    sales_quantity,
                    notes,
                    customer_name,
                    category,
                    created_at,
                    created_by
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s,
                    CURRENT_DATE, %s
                )
                """,
                (
                    history.customer_id,
                    history.product_id,
                    history.status,
                    history.sales_quantity,
                    history.notes,
                    customer_name,
                    category,
                    0
                )
            )

            # 在庫数量を減算
            add_inventory_quantity(
                cursor,
                history.product_id,
                -history.sales_quantity
            )

            # 履歴登録と在庫更新をまとめて確定
            conn.commit()


# ==================
# ステータス修正orキャンセル：販売履歴更新・在庫更新
# ==================

# 販売履歴を更新する
def update_sales_history(history):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:

            # DBから販売履歴を取得
            previous_status, previous_sales_quantity, product_id = get_sales_history(
                cursor,
                history.sales_id
            )

            # DBに登録されているステータスが存在しない場合はエラー
            if previous_status is None:
                raise ValueError("指定された販売履歴IDは存在しません。")

            # 販売履歴がキャンセル済みの場合はエラー
            if previous_status == "キャンセル":
                raise ValueError("指定された販売履歴IDはキャンセル済みです。")

            # 対象商品の在庫を取得してDBロック
            inventory_data = get_inventory_for_update(
                cursor,
                product_id
            )

            # 在庫レコードが存在しない場合はエラー
            if inventory_data is None:
                raise ValueError("在庫レコードが存在しません。")

            # 現在の在庫数量を取得
            stock_quantity = inventory_data[1]

            if history.status == "修正":
                # 修正後の販売数量が0以下の場合はエラー
                if history.sales_quantity <= 0:
                    raise ValueError("入力値エラー。")

                # 修正前後の販売数量の差分を計算
                quantity_difference = (
                    previous_sales_quantity - history.sales_quantity
                )

                # 修正後の販売数量が在庫数量を超える場合はエラー
                if quantity_difference < 0 and abs(quantity_difference) > stock_quantity:
                    raise ValueError("在庫数量が不足しています。")

                # 修正後の販売数量を履歴に反映
                updated_sales_quantity = history.sales_quantity

            elif history.status == "キャンセル":
                # キャンセル前の販売数量を在庫に戻す
                quantity_difference = previous_sales_quantity

                # キャンセル時は元の販売数量を履歴に保持
                updated_sales_quantity = previous_sales_quantity

            else:
                raise ValueError("指定されたステータスは更新できません。")

            # 修正・キャンセル後の在庫数量を計算
            updated_stock_quantity = stock_quantity + quantity_difference

            if updated_stock_quantity < 0:
                # 在庫数量がマイナスになる場合はエラー
                raise ValueError("在庫数量がマイナスになります。")

            # 販売履歴を更新
            cursor.execute(
                """
                UPDATE sales_history
                SET status = %s,
                    sales_quantity = %s,
                    notes = %s,
                    updated_at = CURRENT_DATE,
                    updated_by = %s
                WHERE sales_id = %s
                """,
                (
                    history.status,
                    updated_sales_quantity,
                    history.notes,
                    0,
                    history.sales_id
                )
            )

            # 在庫数量を更新
            add_inventory_quantity(
                cursor,
                product_id,
                quantity_difference
            )

            # 履歴更新と在庫更新をまとめて確定
            conn.commit()
