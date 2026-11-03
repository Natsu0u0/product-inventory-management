# ==================
# API実行・アプリケーション管理
# ==================
from fastapi import FastAPI

# DB接続関数をインポート
from app.database import get_connection

# 接続を閉じるために使用
from contextlib import closing

# 商品APIのRouterをインポート
from app.routers.products import router as products_router
# ユーザAPIのRouterをインポート
from app.routers.users import router as users_router
# 仕入履歴APIのRouterをインポート
from app.routers.purchases import router as purchases_router
# 売上履歴APIのRouterをインポート
from app.routers.sales import router as sales_router
# 在庫APIのRouterをインポート
from app.routers.inventories import router as inventories_router
# 仕入先APIのRouterをインポート
from app.routers.suppliers import router as suppliers_router
# 顧客APIのRouterをインポート
from app.routers.customers import router as customers_router

# CORSミドルウェアをインポート
from fastapi.middleware.cors import CORSMiddleware

# FastAPIのアプリケーションを作成
app = FastAPI()

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 商品APIを登録
app.include_router(products_router)
# ユーザAPIを登録
app.include_router(users_router)
# 仕入履歴APIを登録
app.include_router(purchases_router)
# 売上履歴APIを登録
app.include_router(sales_router)
# 在庫APIを登録
app.include_router(inventories_router)
# 仕入先APIを登録
app.include_router(suppliers_router)
# 顧客APIを登録
app.include_router(customers_router)


# ルートURLへのGETリクエスト
@app.get("/")
def read_root():
    return {"message": "商品・在庫管理API"}


# DB接続確認
@app.get("/db-check")
def check_database():
    try:
        with closing(get_connection()) as connection:
            with closing(connection.cursor()) as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()

                if result == (1,):
                    return {"message": "データベース接続・SQL実行成功"}

                else:
                   return {"message": "データベース接続・SQL実行失敗"} 
    except Exception as e:
        return {"message": "データベース接続失敗", "error": str(e)}