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
# 商品マスタ登録
# ==================

# 商品マスタを登録する
def create_product(product):
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
                (product.category, product.product_name, 0)
            )

            # 変更を確定
            conn.commit()