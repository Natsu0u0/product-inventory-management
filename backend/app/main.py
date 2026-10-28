# ==================
# API実行・アプリケーション管理
# ==================

# FastAPIをインポート
from fastapi import FastAPI

# DB接続関数をインポート
from app.database import get_connection

# 接続を閉じるために使用
from contextlib import closing

# 商品APIのRouterをインポート
from app.routers.products import router as products_router


# FastAPIのアプリケーションを作成
app = FastAPI()

# 商品APIを登録
app.include_router(products_router)


# ルートURLへのGETリクエスト
@app.get("/")
def read_root():
    return {"message": "商品・在庫管理API"}


# DB接続確認
@app.get("/db-check")
def check_database():
    try:
        with closing(get_connection()):
            return {"message": "データベース接続成功"}
    except Exception as e:
        return {"message": "データベース接続失敗", "error": str(e)}