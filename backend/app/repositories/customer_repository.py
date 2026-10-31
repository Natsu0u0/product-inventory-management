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
# 販売先マスタ登録
# ==================

# 販売先マスタを登録する
def create_customer(customer):
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
                    0
                )
            )

            # 変更を確定
            conn.commit()