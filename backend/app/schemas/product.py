# ==================
# リクエストデータの定義・入力チェック
# ==================

# PydanticのBaseModelをインポート
from pydantic import BaseModel


# ==================
# 商品情報
# ==================

# 各種登録時に受け取るデータ
class ProductCreate(BaseModel):
    category: str
    product_name: str

# 商品更新時に受け取るデータ
class ProductUpdate(BaseModel):
    category: str
    product_name: str


# ==================
# 仕入関連
# ==================

# 仕入先登録時に受け取るデータ
class SupplierCreate(BaseModel):
    supplier_name: str
    address: str | None = None
    phone: str | None = None
    notes: str | None = None

# 仕入先更新時に受け取るデータ
class SupplierUpdate(BaseModel):
    supplier_name: str
    address: str | None = None
    phone: str | None = None
    notes: str | None = None

# 仕入履歴登録時に受け取るデータ
class PurchaseCreate(BaseModel):
    supplier_id: int
    product_id: int
    status: str
    purchase_quantity: int
    notes: str | None = None

# 仕入履歴更新時に受け取るデータ
class PurchaseUpdate(BaseModel):
    purchase_id: int
    product_id: int
    status: str
    purchase_quantity: int
    notes: str | None = None


# ==================
# 販売関連
# ==================

# 販売先登録時に受け取るデータ
class CustomerCreate(BaseModel):
    customer_name: str
    address: str | None = None
    phone: str | None = None
    notes: str | None = None

# 販売先更新時に受け取るデータ
class CustomerUpdate(BaseModel):
    customer_name: str
    address: str | None = None
    phone: str | None = None
    notes: str | None = None

# 販売履歴登録時に受け取るデータ
class SalesCreate(BaseModel):
    customer_id: int
    product_id: int
    status: str
    sales_quantity: int
    notes: str | None = None

# 販売履歴更新時に受け取るデータ
class SalesUpdate(BaseModel):
    sales_id: int
    product_id: int
    status: str
    sales_quantity: int
    notes: str | None = None