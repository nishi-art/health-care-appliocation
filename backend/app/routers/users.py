from fastapi import APIRouter   #ルーターのインスタンスを作成するため
from pydantic import BaseModel   #BaseModelクラスの機能を継承するため

class userRegistration(BaseModel):
    email: str
    password: str

class userLogin(BaseModel):
    email: str
    password: str

# ルータのインスタンスを作成
router = APIRouter(prefix="/users")

@router.post("/login")
async def login_user(user: userLogin):
    print("ログインAPIが呼び出されました")
    print(f"受け取ったデータ: email={user.email} password={user.password}")
    return {"message": "ログインしました"}

@router.post("/registration")
async def registration_user(user: userRegistration):
    print("登録APIが呼び出されました")
    print(f"受け取ったデータ: email={user.email} password={user.password}")
    return {"message": "登録しました"}

'''
引数userを用意しているがこれはuserRegistraionクラスを基に
フロントエンドから送信されたデータを使って自動的に
user = userRegistration(
    email: "examle",
    password: "example"
)
のようなインスタンスが生成されている
'''