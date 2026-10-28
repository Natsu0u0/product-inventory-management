# ==================
# データベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection

# 接続とカーソルを閉じるために使用
from contextlib import closing


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


#ユーザーマスタを登録する
def create_user(user):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # ユーザーを登録 %sはプレースホルダーで、後で値を渡すもの
            cursor.execute(
                """
                INSERT INTO users (
                    name,
                    name_kana,
                    password_hash,
                    department,
                    is_admin,
                    created_at,
                    created_by
                )
                VALUES (%s, %s, %s, %s, %s, CURRENT_DATE, %s)
                """,
                (
                    user.name,
                    user.name_kana,
                    user.password_hash,
                    user.department,
                    user.is_admin,
                    0
                )
            )

            # 変更を確定
            conn.commit()


#仕入先マスタを登録する
def create_supplier(supplier):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 仕入先を登録 %sはプレースホルダーで、後で値を渡すもの
            cursor.execute(
                """
                INSERT INTO suppliers (
                    supplier_name,
                    address,
                    phone,
                    notes,
                    created_at,
                    created_by
                )
                VALUES (%s, %s, %s, %s, CURRENT_DATE, %s)
                """,
                (
                    supplier.supplier_name,
                    supplier.address,
                    supplier.phone,
                    supplier.notes,
                    0
                )
            )

            # 変更を確定
            conn.commit()


#販売先マスタを登録する
def create_customer(customer):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 販売先を登録 %sはプレースホルダーで、後で値を渡すもの
            cursor.execute(
                """
                INSERT INTO customers (
                    customer_name,
                    address,
                    phone,
                    notes,
                    created_at,
                    created_by
                )
                VALUES (%s, %s, %s, %s, CURRENT_DATE, %s)
                """,
                (
                    customer.customer_name,
                    customer.address,
                    customer.phone,
                    customer.notes,
                    0
                )
            )

            # 変更を確定
            conn.commit()


# 商品マスタを登録する
def create_product(product):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 商品を登録 %sはプレースホルダーで、後で値を渡すもの
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


# 仕入履歴を登録する
def create_purchase_history(history):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 仕入履歴を登録
            cursor.execute(
                """
                INSERT INTO purchase_history (
                    supplier_id,
                    product_id,
                    status,
                    purchase_quantity,
                    notes,
                    created_at,
                    created_by
                )
                VALUES (%s, %s, DEFAULT, %s, %s, CURRENT_DATE, %s)
                """,
                (
                    history.supplier_id,
                    history.product_id,
                    history.purchase_quantity,
                    history.notes,
                    0
                )
            )

            # 変更を確定
            conn.commit()


#販売履歴を登録する
def create_sales_history(history):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 販売履歴を登録する
            cursor.execute(
                """
                INSERT INTO sales_history (
                    customer_id,
                    product_id,
                    status,
                    sales_quantity,
                    notes,
                    created_at,
                    created_by
                )
                VALUES (%s, %s, DEFAULT, %s, %s, CURRENT_DATE, %s)
                """,
                (
                    history.customer_id,
                    history.product_id,
                    history.sales_quantity,
                    history.notes,
                    0
                )
            )

            # 変更を確定
            conn.commit()


# 在庫管理を登録する
def create_inventory(inventory):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 在庫管理を登録
            cursor.execute(
                """
                INSERT INTO inventories (
                    product_id,
                    stock_quantity,
                    notes,
                    created_at,
                    created_by
                )
                VALUES (%s, %s, %s, CURRENT_DATE, %s)
                """,
                (
                    inventory.product_id,
                    inventory.stock_quantity,
                    inventory.notes,
                    0
                )
            )

            # 変更を確定
            conn.commit()