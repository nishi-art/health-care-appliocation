from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from ..database import crud
from sqlalchemy.orm import Session
from ..database.database import get_db
import os
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

# 環境変数から値を取得
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("環境変数が設定されていません")
ALGORITHM = os.getenv("ALGORITHM", "HS256") # 第２引数はデフォルト値（ALGORITHMが設定されていなかったら）
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# loginエンドポイントからトークンを取得するように指定
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# アクセストークンの作成
def create_accecss_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode_jwt

# 現在のユーザーを取得する
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="認証に失敗しました",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # セキュリティの観点からリストで
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_user_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception
    return user