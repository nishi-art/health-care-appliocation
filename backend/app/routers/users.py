from fastapi import APIRouter

# ルータのインスタンスを作成
router = APIRouter(prefix="/users")

@router.post("/login")
async def login_user():
    print("ログインAPIが呼び出されました")
    return {"message": "ログインしました"}