from fastapi import APIRouter   #ルーターのインスタンスを作成するため
from pydantic import BaseModel   #BaseModelクラスの機能を継承するため
from ..database import crud, schemas, models
from ..auth.token import create_accecss_token, get_current_user
from ..database.database import get_db
from ..auth .passwordService import verify_password
from ..services .vector_service import vectorization
from ..services .similarity_search_service import similarity_search
from ..services .translate_service import translate_text
from ..services .gemini_service import request_gemini
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, Request

# ルータのインスタンスを作成
router = APIRouter(prefix="/users")

# フラグ
is_generating: bool = False


# ユーザー登録
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

# ユーザーログイン
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

# カレンダーのメモデータ取得
@router.get("/healthcare/get", response_model=schemas.MemoResponse)
async def get_calender_data(
    year: int, 
    month: int, 
    day: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    memo = crud.get_user_memo(db, current_user.id, year, month, day)
    if memo:
        return memo
    # データがない場合は空のレスポンス
    return {
        "id": 0,
        "year": year,
        "month": month,
        "day": day,
        "meal": "",
        "exercse": "",
        "hospital": "",
        "other": "",
        "weight": "",
    }

# カレンダーのデータ保存
@router.post("/healthcare/save", response_model=schemas.MemoResponse)
async def save_calender_data(
    memo: schemas.MemoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_memo = crud.create_or_update_memo(db, current_user.id, memo)
    return db_memo

# 指定した年月のカレンダーメモのhospitalデータ取得
@router.get("/hospital/list", response_model=list[schemas.HospitalMemoResponse])
async def get_mothly_hospital_memos(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    memos = db.query(models.Memo).filter_by(
        user_id=current_user.id, year=year, month=month
        ).all()
    print("hospitalメモ:",memos)
    return memos

# 指定した年月のカレンダーメモのweightデータ取得
@router.get("/weight/list", response_model=list[schemas.WeightMemoResponse])
async def get_monthly_weight_memos(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    memos = db.query(models.Memo).filter_by(
        user_id=current_user.id, year=year, month=month
    ).all()
    print("weightメモ:",memos)
    return memos

# AIへの質問
@router.post("/question")
async def post_ai_answer(question_content: schemas.QuestionContent, request: Request):
    global is_generating

    if is_generating:
        raise HTTPException(
            status_code=429,
            detail="現在別の処理を行っています。10秒ほど待って再度操作を行ってください。"
        )

    try:
        is_generating = True
        question = question_content.user_input
        translated_question = translate_text(question)
        # ユーザーの質問をベクトルに変換
        question_vector = vectorization(translated_question)

        # ユーザーが接続を切断していないか確認(質問のキャンセルも)
        if await request.is_disconnected():
            return

        # データセットから質問との類似度が高いものを３つ抽出
        top_3_docs = similarity_search(question_vector)
        response_text = request_gemini(question, top_3_docs)
        return response_text
    finally:
        is_generating = False