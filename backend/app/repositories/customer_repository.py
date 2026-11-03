# ==================
# 販売先情報のデータベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection

# 接続とカーソルを閉じるために使用
from contextlib import closing


# ==================
# 販売先情報取得
# ==================

# 販売先名を取得する
def get_customer(customer_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 販売先名を取得
            cursor.execute(
                """
                SELECT customer_name
                FROM customers
                WHERE customer_id = %s
                """,
                (customer_id,)
            )

            # 取得した1行を受け取る
            customer = cursor.fetchone()

            # 販売先が存在しない場合はエラー
            if customer is None:
                raise ValueError("指定された販売先が存在しません")

            # 販売先情報を返す
            return customer[0]


# ==================
# 販売先一覧取得
# ==================

# 販売先一覧を取得する
def get_customers():
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 販売先一覧を取得
            cursor.execute(
                """
                SELECT customer_id, customer_name, address, phone, notes
                FROM customers
                ORDER BY customer_id
                """
            )

            # 取得した全行を受け取る
            rows = cursor.fetchall()

            # 販売先一覧を格納するリスト
            customers = []

            # 取得した行ごとに処理
            for row in rows:
                # 辞書型に変換
                customer = {
                    "customer_id": row[0],
                    "customer_name": row[1],
                    "address": row[2],
                    "phone": row[3],
                    "notes": row[4]
                }

                # リストに追加
                customers.append(customer)

            # 販売先一覧を返す
            return customers


# ==================
# 販売先マスタ登録
# ==================

# 販売先マスタを登録する
def create_customer(customer, user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 販売先を登録
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
                    user_id
                )
            )

            # 変更を確定
            conn.commit()


# ==================
# 販売先マスタ更新
# ==================

# 販売先マスタを更新する
def update_customer(customer_id, customer, user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 販売先を更新
            cursor.execute(
                """
                UPDATE customers
                SET customer_name = %s,
                    address = %s,
                    phone = %s,
                    notes = %s,
                    updated_at = CURRENT_DATE,
                    updated_by = %s
                WHERE customer_id = %s
                """,
                (
                    customer.customer_name,
                    customer.address,
                    customer.phone,
                    customer.notes,
                    user_id,
                    customer_id
                )
            )

            # 更新が行われなかった場合はFalseを返す
            if cursor.rowcount == 0:
                return False

            # 変更を確定
            conn.commit()

            # 更新が成功した場合はTrueを返す
            return True


# ==================
# 販売先マスタ削除
# ==================

# 販売先マスタを削除する
def delete_customer(customer_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 販売先を削除
            cursor.execute(
                """
                DELETE FROM customers
                WHERE customer_id = %s
                """,
                (customer_id,)
            )

            # 削除が行われなかった場合はFalseを返す
            if cursor.rowcount == 0:
                return False

            # 変更を確定
            conn.commit()

            # 削除が成功した場合はTrueを返す
            return True