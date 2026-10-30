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
        SELECT inventory_id
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
def create_inventory(cursor, product_id, quantity):
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
            0
        )
    )


# ==================
# 在庫数量更新
# ==================

# 在庫数量を加算する
def add_inventory_quantity(cursor, product_id, quantity):
    cursor.execute(
        """
        UPDATE inventories
        SET stock_quantity = stock_quantity + %s,
            updated_at = CURRENT_DATE,
            updated_by = %s
        WHERE product_id = %s
        """,
        (
            quantity,
            0,
            product_id
        )
    )