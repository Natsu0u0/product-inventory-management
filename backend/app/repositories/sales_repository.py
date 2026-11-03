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
    cursor.execute("""
        SELECT status, sales_quantity, product_id
        FROM sales_history
        WHERE sales_id = %s
        FOR UPDATE
    """, (sales_id,))

    sales_history = cursor.fetchone()

    if sales_history is None:
        return None, None, None

    return sales_history


# ==================
# ステータス新規or追加：販売履歴登録・在庫更新
# ==================

# 販売履歴を登録する
def create_sales_history(history, user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:

            # 販売数量が0以下の場合はエラー
            if history.sales_quantity <= 0:
                raise ValueError("販売数量は1以上を指定してください。")

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
            cursor.execute("""
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
            """, (
                history.customer_id,
                history.product_id,
                history.status,
                history.sales_quantity,
                history.notes,
                customer_name,
                category,
                user_id
            ))

            # 在庫数量を減算
            add_inventory_quantity(
                cursor,
                history.product_id,
                -history.sales_quantity,
                user_id
            )

            # 履歴登録と在庫更新をまとめて確定
            conn.commit()


# ==================
# ステータス修正：販売履歴更新・在庫更新
# ==================

# 販売履歴を更新する
def update_sales_history(history, user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:

            # DBから販売履歴を取得
            previous_status, previous_sales_quantity, previous_product_id = (
                get_sales_history(cursor, history.sales_id)
            )

            # DBに登録されているステータスが存在しない場合はエラー
            if previous_status is None:
                raise ValueError("指定された販売履歴番号は存在しません。")

            # キャンセル履歴は編集できない
            if previous_status == "キャンセル":
                raise ValueError("キャンセル履歴は修正できません。")

            # 既にキャンセルされている元履歴か確認
            cancellation_note = (
                f"キャンセル元販売履歴番号：{history.sales_id}"
            )

            cursor.execute("""
                SELECT EXISTS (
                    SELECT 1
                    FROM sales_history
                    WHERE notes = %s
                )
            """, (cancellation_note,))

            if cursor.fetchone()[0]:
                raise ValueError("キャンセル済みの履歴は修正できません。")

            # 修正後の販売数量が0以下の場合はエラー
            if history.sales_quantity <= 0:
                raise ValueError("販売数量は1以上を指定してください。")

            # 商品カテゴリを取得
            category = get_product_category(history.product_id)

            # 商品が変更されていない場合
            if previous_product_id == history.product_id:

                # 対象商品の在庫を取得してDBロック
                inventory = get_inventory_for_update(
                    cursor,
                    previous_product_id
                )

                if inventory is None:
                    raise ValueError("在庫レコードが存在しません。")

                # 現在の在庫数量を取得
                stock_quantity = inventory[1]

                # 変更前後の販売数量の差分を計算
                quantity_difference = (
                    previous_sales_quantity - history.sales_quantity
                )

                # 修正後の在庫数量を計算
                updated_stock_quantity = (
                    stock_quantity + quantity_difference
                )

                if updated_stock_quantity < 0:
                    raise ValueError("在庫数量が不足しているため修正できません。")

                # 在庫数量を差分だけ調整
                add_inventory_quantity(
                    cursor,
                    previous_product_id,
                    quantity_difference,
                    user_id
                )

            # 商品が変更された場合
            else:
                # 変更前の商品と変更後の商品をロック
                inventory_data = {}

                for product_id in sorted([
                    previous_product_id,
                    history.product_id
                ]):
                    inventory_data[product_id] = get_inventory_for_update(
                        cursor,
                        product_id
                    )

                previous_inventory = inventory_data[previous_product_id]
                new_inventory = inventory_data[history.product_id]

                # 在庫レコードが存在しない場合はエラー
                if previous_inventory is None or new_inventory is None:
                    raise ValueError("在庫レコードが存在しません。")

                # 変更後の商品に必要な在庫があるか確認
                if history.sales_quantity > new_inventory[1]:
                    raise ValueError("在庫数量が不足しています。")

                # 変更前の商品に販売数量を戻す
                add_inventory_quantity(
                    cursor,
                    previous_product_id,
                    previous_sales_quantity,
                    user_id
                )

                # 変更後の商品から販売数量を減算
                add_inventory_quantity(
                    cursor,
                    history.product_id,
                    -history.sales_quantity,
                    user_id
                )

            # 販売履歴を更新
            cursor.execute("""
                UPDATE sales_history
                SET
                    product_id = %s,
                    category = %s,
                    status = '修正済み',
                    sales_quantity = %s,
                    notes = %s,
                    updated_at = CURRENT_DATE,
                    updated_by = %s
                WHERE sales_id = %s
            """, (
                history.product_id,
                category,
                history.sales_quantity,
                history.notes,
                user_id,
                history.sales_id
            ))

            # 履歴更新と在庫更新をまとめて確定
            conn.commit()


# ==================
# 販売履歴一覧を取得
# ==================

# 販売履歴一覧を取得する
def get_sales_histories():
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                """
                SELECT
                    sh.sales_id,
                    sh.customer_id,
                    sh.product_id,
                    p.product_name,
                    sh.category,
                    sh.status,
                    sh.sales_quantity,
                    sh.notes,
                    sh.created_at,
                    sh.customer_name
                FROM sales_history AS sh
                INNER JOIN products AS p
                    ON sh.product_id = p.product_id
                ORDER BY sh.sales_id DESC
                LIMIT 30
                """
            )

            # 取得した全レコードを受け取る
            sales_histories = cursor.fetchall()

            # 販売履歴一覧を返す
            return sales_histories


# ==================
# 販売履歴キャンセル：新しい履歴を登録・在庫を加算
# ==================

# 販売履歴をキャンセルする
def cancel_sales_history(sales_id, user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:

            # キャンセル対象の販売履歴を取得し、行をロック
            cursor.execute("""
                SELECT
                    customer_id,
                    product_id,
                    sales_quantity,
                    customer_name,
                    category,
                    status,
                    notes
                FROM sales_history
                WHERE sales_id = %s
                FOR UPDATE
            """, (sales_id,))

            history = cursor.fetchone()

            if history is None:
                raise ValueError("指定された販売履歴番号は存在しません。")

            (
                customer_id,
                product_id,
                sales_quantity,
                customer_name,
                category,
                status,
                notes
            ) = history

            # キャンセル履歴そのものはキャンセルできない
            if status == "キャンセル":
                raise ValueError("キャンセル履歴は再度キャンセルできません。")

            # 既にキャンセルされている履歴か確認
            cancellation_note = f"キャンセル元販売履歴番号：{sales_id}"

            cursor.execute("""
                SELECT EXISTS (
                    SELECT 1
                    FROM sales_history
                    WHERE notes = %s
                )
            """, (cancellation_note,))

            if cursor.fetchone()[0]:
                raise ValueError("この販売履歴は既にキャンセルされています。")

            # 在庫を取得してロック
            inventory = get_inventory_for_update(
                cursor,
                product_id
            )

            if inventory is None:
                raise ValueError("在庫レコードが存在しません。")

            # キャンセル履歴を新規登録
            cursor.execute("""
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
                    %s, %s, 'キャンセル', %s, %s, %s, %s,
                    CURRENT_DATE, %s
                )
            """, (
                customer_id,
                product_id,
                sales_quantity,
                cancellation_note,
                customer_name,
                category,
                user_id
            ))

            # キャンセルにより販売数量を在庫に戻す
            add_inventory_quantity(
                cursor,
                product_id,
                sales_quantity,
                user_id
            )

            # キャンセル履歴登録と在庫更新をまとめて確定
            conn.commit()