from fastapi import APIRouter   #ルーターのインスタンスを作成するため
from pydantic import BaseModel   #BaseModelクラスの機能を継承するため
from ..database import crud, schemas, models
from ..auth.token import create_accecss_token, get_current_user
from ..database.database import get_db
from ..auth .passwordService import verify_password
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import HTTPException

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
    if not verify_password(plain_password=user.password, hashed_password=db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが正しくありません"
        )
    # トークンの生成
    access_token = create_accecss_token(data={"sub": user.email})
    
    print("ログインAPIが呼び出されました")
    print(f"受け取ったデータ: email={user.email} password={user.password}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "ログインしました"
        }

# 認証済みのユーザーの情報を返す
@router.get("/me")
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


'''
引数userを用意しているがこれはuserRegistraionクラスを基に
フロントエンドから送信されたデータを使って自動的に
user = userRegistration(
    email: "examle",
    password: "example"
)
のようなインスタンスが生成されている
'''