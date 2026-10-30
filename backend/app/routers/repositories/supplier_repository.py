# ==================
# 仕入先情報のデータベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection

# 接続とカーソルを閉じるために使用
from contextlib import closing


# ==================
# 仕入先情報取得
# ==================

# 仕入先名を取得する
def get_supplier(supplier_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 仕入先名を取得
            cursor.execute(
                """
                SELECT supplier_name
                FROM suppliers
                WHERE supplier_id = %s
                """,
                (supplier_id,)
            )

            # 取得した1行を受け取る
            supplier = cursor.fetchone()

            # 仕入先が存在しない場合はエラー
            if supplier is None:
                raise ValueError("指定された仕入先が存在しません")

            # 仕入先情報を返す
            return supplier[0]


# ==================
# 仕入先マスタ登録
# ==================

# 仕入先マスタを登録する
def create_supplier(supplier):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # 仕入先を登録
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