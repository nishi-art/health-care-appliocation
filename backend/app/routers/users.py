from fastapi import APIRouter   #ルーターのインスタンスを作成するため
from pydantic import BaseModel   #BaseModelクラスの機能を継承するため
from ..database import crud, schemas
from ..database.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import HTTPException

'''
class userRegistration(BaseModel):
    email: str
    password: str

class userLogin(BaseModel):
    email: str
    password: str
'''

# ルータのインスタンスを作成
router = APIRouter(prefix="/users")

@router.post("/registration", response_model=schemas.UserResponse)  # ハッシュ化されたパスワードなどを除外してJSON形式でレスポンスを返す
async def registration_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 重複チェック
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="このメールアドレスは既に使用されています"
        )
    print("登録APIが呼び出されました")
    print(f"受け取ったデータ: email={user.email} password={user.password}")
    # ユーザー作成
    return crud.create_user(db=db, user=user)

@router.post("/login")
async def login_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # ユーザー情報の取得
    db_user = crud.get_user_by_email(db=db, email=user.email)
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが正しくありません"
        )
    # パスワードの検証
    if not crud.verify_password(plain_password=user.password, hashed_password=db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが正しくありません"
        )
    print("ログインAPIが呼び出されました")
    print(f"受け取ったデータ: email={user.email} password={user.password}")
    return {"message": "ログインしました"}


'''
引数userを用意しているがこれはuserRegistraionクラスを基に
フロントエンドから送信されたデータを使って自動的に
user = userRegistration(
    email: "examle",
    password: "example"
)
のようなインスタンスが生成されている
'''