from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from ..database import crud, models
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