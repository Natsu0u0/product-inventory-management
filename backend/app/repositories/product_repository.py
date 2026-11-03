# ==================
# 商品情報のデータベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection

# 接続とカーソルを閉じるために使用
from contextlib import closing


# ==================
# 商品情報取得
# ==================

# 商品一覧を取得する
def get_products():
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 商品一覧を取得
            cursor.execute(
                "SELECT product_id, category, product_name FROM products"
            )

            # 取得した全行を受け取る
            rows = cursor.fetchall()

            # 商品一覧を格納するリスト
            products = []

            # 取得した行ごとに処理
            for row in rows:
                # 辞書型に変換
                product = {
                    "product_id": row[0],
                    "category": row[1],
                    "product_name": row[2]
                }

                # リストに追加
                products.append(product)

            # 商品一覧を返す
            return products


# ==================
# 商品カテゴリ取得
# ==================

# 商品カテゴリを取得する
def get_product_category(product_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 商品カテゴリを取得
            cursor.execute(
                """
                SELECT category
                FROM products
                WHERE product_id = %s
                """,
                (product_id,)
            )

            # 取得した1行を受け取る
            row = cursor.fetchone()

            # 商品が存在しない場合はエラー
            if row is None:
                raise ValueError("指定された商品が存在しません。")

            # 商品カテゴリを返す
            return row[0]


# ==================
# 商品詳細情報取得
# ==================

# 商品詳細情報を取得する
def get_product(product_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 商品詳細情報を取得
            cursor.execute(
                """
                SELECT product_id, category, product_name
                FROM products
                WHERE product_id = %s
                """,
                (product_id,)
            )
            row = cursor.fetchone()

    if row:
        product = {
            "product_id": row[0],
            "category": row[1],
            "product_name": row[2]
        }
        return product

    return None


# ==================
# 商品マスタ登録
# ==================

# 商品マスタを登録する
def create_product(product, user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 商品を登録
            cursor.execute(
                """
                INSERT INTO products (
                    category,
                    product_name,
                    created_at,
                    created_by
                )
                VALUES (%s, %s, CURRENT_DATE, %s)
                """,
                (product.category, product.product_name, user_id)
            )

            # 変更を確定
            conn.commit()


# ==================
# 商品マスタ更新
# ==================

# 商品マスタを更新する
def update_product(product_id, product, user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 商品を更新
            cursor.execute(
                """
                UPDATE products
                SET category = %s,
                    product_name = %s,
                    updated_at = CURRENT_DATE,
                    updated_by = %s
                WHERE product_id = %s
                """,
                (product.category, product.product_name, user_id, product_id)
            )

            # 更新が行われなかった場合はFalseを返す
            if cursor.rowcount == 0:
                return False

            # 変更を確定
            conn.commit()

            # 更新が成功した場合はTrueを返す
            return True


# ==================
# 商品マスタ削除
# ==================

# 商品マスタを削除する
def delete_product(product_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 商品を削除
            cursor.execute(
                """
                DELETE FROM products
                WHERE product_id = %s
                """,
                (product_id,)
            )

            # 削除が行われなかった場合はFalseを返す
            if cursor.rowcount == 0:
                return False

            # 変更を確定
            conn.commit()

            # 削除が成功した場合はTrueを返す
            return True