from fastapi import FastAPI
from app.routers import users
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import init_db

app = FastAPI()

# CORS設定
origins = ["http://localhost:3000",]
app.add_middleware(
    CORSMiddleware, # 第一引数でクラスを受け取って設定と共に内部的にインスタンスを生成している
    allow_origins = origins, # 許可するオリジン
    allow_credentials = True, # クッキーなどの情報を含めることを許可
    allow_methods = ["*"], # 全てのHTTPメソッドを許可
    allow_headers = ["*"], # 全てのヘッダーを許可
)

# users.routerをメインのインスタンス(app)に組み込む
app.include_router(users.router)

@app.on_event("startup")
async def on_startup():
    init_db() # データベースの初期化（テーブルが存在しない場合のみ作成）