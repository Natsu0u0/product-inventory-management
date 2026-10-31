# ==================
# リクエストデータの定義・入力チェック
# ==================

# PydanticのBaseModelをインポート
from pydantic import BaseModel

# 商品登録時に受け取るデータを定義
class ProductCreate(BaseModel):
    category: str
    product_name: str

# 仕入履歴登録時に受け取るデータを定義
class PurchaseCreate(BaseModel):
    supplier_id: int
    product_id: int
    status: str
    purchase_quantity: int
    notes: str | None = None

# 仕入履歴更新時に受け取るデータを定義
class PurchaseUpdate(BaseModel):
    purchase_id: int
    product_id: int
    status: str
    purchase_quantity: int
    notes: str | None = None