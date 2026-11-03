
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
# 仕入履歴の情報を取得
# ==================

# 仕入履歴レコードの存在確認
def get_purchase_history(cursor, purchase_id):
    cursor.execute("""
        SELECT status, purchase_quantity
        FROM purchase_history
        WHERE purchase_id = %s
        FOR UPDATE
    """, (purchase_id,))

    history = cursor.fetchone()

    if history is None:
        return None, None

    return history


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
                SELECT EXISTS (
                    SELECT 1
                    FROM inventories
                    WHERE product_id = %s
                )
                """,
                (product_id,)
            )
            # 取得した1行を受け取る
            inventory_exists = cursor.fetchone()
            return inventory_exists[0]


# ==================
# ステータス新規or追加：仕入履歴登録・在庫登録or更新
# ==================

# 仕入履歴を登録する
def create_purchase_history(history, user_id):
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
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s,
                    CURRENT_DATE, %s
                )
                """,
                (
                    history.supplier_id,
                    history.product_id,
                    history.status,
                    history.purchase_quantity,
                    history.notes,
                    supplier_name,
                    category,
                    user_id
                )
            )

            # 対象商品の在庫を取得してDBロック
            inventory = get_inventory_for_update(
                cursor,
                history.product_id,
            )

            # 在庫レコードが存在しない場合は新規登録
            if inventory is None:
                create_inventory(
                    cursor,
                    history.product_id,
                    history.purchase_quantity,
                    user_id
                )

            # 在庫レコードが存在する場合は数量を加算
            else:
                add_inventory_quantity(
                    cursor,
                    history.product_id,
                    history.purchase_quantity,
                    user_id
                )

            # 履歴登録と在庫登録or更新をまとめて確定
            conn.commit()


# ==================
# ステータス修正：仕入履歴更新・在庫更新
# ==================

def update_purchase_history(history, user_id):
    with closing(get_connection()) as conn:
        with closing(conn.cursor()) as cursor:
            # 編集対象の履歴を取得
            previous_status, previous_purchase_quantity = get_purchase_history(
                cursor,
                history.purchase_id
            )

            if previous_status is None:
                raise ValueError("指定された仕入履歴番号は存在しません。")

            # キャンセル履歴は編集できない
            if previous_status == "キャンセル":
                raise ValueError("キャンセル履歴は修正できません。")

            # 既にキャンセルされている元履歴か確認
            cancellation_note = (
                f"キャンセル元仕入履歴番号：{history.purchase_id}"
            )

            cursor.execute("""
                SELECT EXISTS (
                    SELECT 1
                    FROM purchase_history
                    WHERE notes = %s
                )
            """, (cancellation_note,))

            if cursor.fetchone()[0]:
                raise ValueError("キャンセル済みの履歴は修正できません。")

            if history.purchase_quantity <= 0:
                raise ValueError("仕入数量は1以上を指定してください。")

            # 在庫を取得してロック
            inventory = get_inventory_for_update(
                cursor,
                history.product_id
            )

            if inventory is None:
                raise ValueError("在庫レコードが存在しません。")

            stock_quantity = inventory[1]

            # 変更前後の数量差を計算
            quantity_difference = (
                history.purchase_quantity - previous_purchase_quantity
            )

            updated_stock_quantity = stock_quantity + quantity_difference

            if updated_stock_quantity < 0:
                raise ValueError("在庫数量がマイナスになるため修正できません。")

            # 履歴を更新
            cursor.execute("""
                UPDATE purchase_history
                SET
                    status = '修正済み',
                    purchase_quantity = %s,
                    notes = %s,
                    updated_at = CURRENT_DATE,
                    updated_by = %s
                WHERE purchase_id = %s
            """, (
                history.purchase_quantity,
                history.notes,
                user_id,
                history.purchase_id
            ))

            # 在庫を差分だけ調整
            add_inventory_quantity(
                cursor,
                history.product_id,
                quantity_difference,
                user_id
            )

            conn.commit()


# ==================
# 仕入履歴一覧を取得
# ==================

# 仕入履歴一覧を取得する
def get_purchase_histories():
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                """
                SELECT
                    ph.purchase_id,
                    ph.supplier_id,
                    ph.product_id,
                    p.product_name,
                    ph.category,
                    ph.status,
                    ph.purchase_quantity,
                    ph.notes,
                    ph.created_at,
                    ph.supplier_name
                FROM purchase_history AS ph
                INNER JOIN products AS p
                    ON ph.product_id = p.product_id
                ORDER BY ph.purchase_id DESC
                LIMIT 30
                """
            )

            # 取得した全レコードを受け取る
            purchase_histories = cursor.fetchall()

            # 仕入履歴一覧を返す
            return purchase_histories


# ==================
# 仕入履歴キャンセル：新しい履歴を登録・在庫を減算
# ==================

def cancel_purchase_history(purchase_id, user_id):
    with closing(get_connection()) as conn:
        with closing(conn.cursor()) as cursor:
            # キャンセル対象の仕入履歴を取得し、行をロック
            cursor.execute("""
                SELECT
                    supplier_id,
                    product_id,
                    purchase_quantity,
                    supplier_name,
                    category,
                    status,
                    notes
                FROM purchase_history
                WHERE purchase_id = %s
                FOR UPDATE
            """, (purchase_id,))

            history = cursor.fetchone()

            if history is None:
                raise ValueError("指定された仕入履歴番号は存在しません。")

            (
                supplier_id,
                product_id,
                purchase_quantity,
                supplier_name,
                category,
                status,
                notes
            ) = history

            # キャンセル履歴そのものはキャンセルできない
            if status == "キャンセル":
                raise ValueError("キャンセル履歴は再度キャンセルできません。")

            # 既にキャンセルされている履歴か確認
            cancellation_note = f"キャンセル元仕入履歴番号：{purchase_id}"

            cursor.execute("""
                SELECT EXISTS (
                    SELECT 1
                    FROM purchase_history
                    WHERE notes = %s
                )
            """, (cancellation_note,))

            if cursor.fetchone()[0]:
                raise ValueError("この仕入履歴は既にキャンセルされています。")

            # 在庫を取得してロック
            inventory = get_inventory_for_update(cursor, product_id)

            if inventory is None:
                raise ValueError("在庫レコードが存在しません。")

            stock_quantity = inventory[1]

            if stock_quantity < purchase_quantity:
                raise ValueError("在庫数量がマイナスになるためキャンセルできません。")

            # キャンセル履歴を新規登録
            cursor.execute("""
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
                VALUES (%s, %s, 'キャンセル', %s, %s, %s, %s, CURRENT_DATE, %s)
            """, (
                supplier_id,
                product_id,
                purchase_quantity,
                cancellation_note,
                supplier_name,
                category,
                user_id
            ))

            # 在庫を減らす
            add_inventory_quantity(
                cursor,
                product_id,
                -purchase_quantity,
                user_id
            )

            # 仕入履歴のキャンセルと在庫の減算をまとめて確定
            conn.commit()