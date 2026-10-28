# ==================
# リクエストデータの定義・入力チェック
# ==================

# PydanticのBaseModelをインポート
from pydantic import BaseModel

# 商品登録時に受け取るデータを定義
class ProductCreate(BaseModel):
    category: str
    product_name: str