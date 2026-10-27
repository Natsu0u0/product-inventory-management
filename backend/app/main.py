#FastAPIライブラリのFastAPIをインポート
from fastapi import FastAPI

#database.pyをインポート(app配下にあるdatabase.pyをインポートするために、app.databaseと記述)
from app.database import get_connection

#contextlibのclosingをインポート
from contextlib import closing

#APIを作る
app = FastAPI()

#ルートURLへのGETリクエスト
@app.get("/")
def read_root():
    #処理結果をJSON形式で返却
    return {"message": "商品・在庫管理API"}

@app.get("/db-check")
def check_database():
    conn = None
    try:
        with closing(get_connection()) as conn:
            return {"message": "データベース接続成功"}
    except Exception as e:
        return {"message": "データベース接続失敗", "error": str(e)}