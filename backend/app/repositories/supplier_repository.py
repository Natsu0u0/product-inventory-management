
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
def create_supplier(supplier, user_id):
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
                    user_id
                )
            )

            # 変更を確定
            conn.commit()


# ==================
# 仕入先一覧取得
# ==================

def get_suppliers():
    with closing(get_connection()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                """
                SELECT supplier_id, supplier_name, address, phone, notes
                FROM suppliers
                ORDER BY supplier_id
                """
            )

            rows = cursor.fetchall()
            suppliers = []

            for row in rows:
                supplier = {
                    "supplier_id": row[0],
                    "supplier_name": row[1],
                    "address": row[2],
                    "phone": row[3],
                    "notes": row[4]
                }
                suppliers.append(supplier)

            return suppliers


# ==================
# 仕入先マスタ更新
# ==================

def update_supplier(supplier_id, supplier, user_id):
    with closing(get_connection()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                """
                UPDATE suppliers
                SET supplier_name = %s,
                    address = %s,
                    phone = %s,
                    notes = %s,
                    updated_at = CURRENT_DATE,
                    updated_by = %s
                WHERE supplier_id = %s
                """,
                (
                    supplier.supplier_name,
                    supplier.address,
                    supplier.phone,
                    supplier.notes,
                    user_id,
                    supplier_id
                )
            )

            if cursor.rowcount == 0:
                return False

            conn.commit()
            return True


# ==================
# 仕入先マスタ削除
# ==================

def delete_supplier(supplier_id):
    with closing(get_connection()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(
                """
                DELETE FROM suppliers
                WHERE supplier_id = %s
                """,
                (supplier_id,)
            )

            if cursor.rowcount == 0:
                return False

            conn.commit()
            return True
