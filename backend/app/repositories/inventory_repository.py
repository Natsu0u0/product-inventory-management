
# ==================
# 在庫情報のデータベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection

# 接続とカーソルを閉じるために使用
from contextlib import closing


# ==================
# 在庫情報取得
# ==================

# 在庫レコードを取得してロックする
def get_inventory_for_update(cursor, product_id):
    # 対象商品の在庫を取得してロック
    cursor.execute(
        """
        SELECT inventory_id,
        stock_quantity
        FROM inventories
        WHERE product_id = %s
        FOR UPDATE
        """,
        (product_id,)
    )

    # 取得した1行を返す
    return cursor.fetchone()


# ==================
# 在庫レコード登録
# ==================

# 在庫レコードを新規登録する
def create_inventory(cursor, product_id, quantity, user_id):
    cursor.execute(
        """
        INSERT INTO inventories (
            product_id,
            stock_quantity,
            created_at,
            created_by
        )
        VALUES (%s, %s, CURRENT_DATE, %s)
        """,
        (
            product_id,
            quantity,
            user_id
        )
    )


# ==================
# 在庫数量更新
# ==================

# 在庫数量を加算する
def add_inventory_quantity(cursor, product_id, quantity, user_id):

    cursor.execute(
        """
        UPDATE inventories
        -- 在庫数量を計算する(渡された quantity がプラスでもマイナスでも対応できる)
        SET stock_quantity = stock_quantity + %s,
            updated_at = CURRENT_DATE,
            updated_by = %s
        WHERE product_id = %s
        """,
        (
            quantity,
            user_id,
            product_id
        )
    )


# ==================
# 在庫一覧取得
# ==================

# 在庫一覧を取得する
def get_inventories():
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 在庫一覧を取得
            cursor.execute(
                """
                SELECT
                    inventories.inventory_id,
                    inventories.product_id,
                    products.category,
                    products.product_name,
                    inventories.stock_quantity,
                    inventories.notes
                FROM inventories
                INNER JOIN products
                    ON inventories.product_id = products.product_id
                ORDER BY inventories.inventory_id
                """
            )

            # 取得した全行を受け取る
            rows = cursor.fetchall()

            # 在庫一覧を格納するリスト
            inventories = []

            # 取得した行ごとに処理
            for row in rows:
                # 辞書型に変換
                inventory = {
                    "inventory_id": row[0],
                    "product_id": row[1],
                    "category": row[2],
                    "product_name": row[3],
                    "stock_quantity": row[4],
                    "notes": row[5]
                }

                # リストに追加
                inventories.append(inventory)

            # 在庫一覧を返す
            return inventories


# ==================
# 在庫データ削除
# ==================

# 在庫数が0の場合、在庫データを削除する
def delete_inventory(inventory_id):

    # DBに接続
    with closing(get_connection()) as conn:
        try:
            with closing(conn.cursor()) as cursor:

                # 対象の在庫データを取得してロック
                cursor.execute(
                    """
                    SELECT stock_quantity
                    FROM inventories
                    WHERE inventory_id = %s
                    FOR UPDATE
                    """,
                    (inventory_id,)
                )

                inventory = cursor.fetchone()

                # 対象データが存在しない場合
                if inventory is None:
                    return "not_found"

                # 在庫が残っている場合
                if inventory[0] > 0:
                    return "stock_exists"

                # 在庫データを削除
                cursor.execute(
                    """
                    DELETE FROM inventories
                    WHERE inventory_id = %s
                    """,
                    (inventory_id,)
                )

            conn.commit()

            return "success"

        except Exception:
            conn.rollback()
            raise
