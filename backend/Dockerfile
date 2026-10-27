#pythonを使う環境の設定
FROM python:3.12-slim

#作業ディレクトリの設定
WORKDIR /app

#依存関係の一覧をコンテナにコピーする
COPY requirements.txt .

#一覧に書かれたPythonライブラリをインストールする
RUN pip install --no-cache-dir -r requirements.txt

#バックエンドのファイルをコンテナにコピーする
COPY . .

#コンテナ起動時にFastAPIを起動する
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
