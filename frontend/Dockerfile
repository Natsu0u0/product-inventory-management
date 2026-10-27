#Node.jsを使う環境の設定
FROM node:24-bookworm-slim 

#作業ディレクトリの設定
WORKDIR /app

#依存環境のファイルのコピー
COPY package.json package-lock.json ./

#依存環境のインストール
RUN npm install

##フロントエンドのファイルをコンテナにコピーする
COPY . .

#ポート番号の設定
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]