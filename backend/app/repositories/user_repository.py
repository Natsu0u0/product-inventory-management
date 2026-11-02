
# ==================
# ユーザ情報のデータベースアクセス・SQL実行
# ==================

# DB接続関数をインポート
from app.database import get_connection
# 接続とカーソルを閉じるために使用
from contextlib import closing


# ==================
# ユーザ詳細情報取得
# ==================

# ユーザ詳細情報を取得する
def get_user(user_id):
    # DBに接続
    with closing(get_connection()) as conn:
        # SQLを操作するカーソルを作成
        with closing(conn.cursor()) as cursor:
            # ユーザ詳細情報を取得
            cursor.execute(
                """
                SELECT user_id, password_hash
                FROM users
                WHERE user_id = %s
                """,
                (user_id,)
            )
            row = cursor.fetchone()

    if row:
        user = {
            "user_id": row[0],
            "password_hash": row[1]
        }
        return user

    return None


# ==================
# ログイン
# ==================

def login(user_id, password):
    user = get_user(user_id)

    # ユーザ情報が見つからない場合
    if user is None:
        return {"message": "ユーザIDまたはパスワードが違います"}

    # パスワードを照合
    if not password_hash.verify(password, user["password_hash"]):
        return {"message": "ユーザIDまたはパスワードが違います"}

    # ログイン成功
    return {"message": "ログイン成功"}