import os
import psycopg

# データベースの接続情報を環境変数から取得
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "inventory")
DB_USER = os.getenv("DB_USER", "appuser")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")


# データベースに接続する
#DB接続を呼び出せるように定義
def get_connection():
    #PostgreSQLへの接続
    return psycopg.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )