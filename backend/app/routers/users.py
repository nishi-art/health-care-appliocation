from fastapi import APIRouter   #ルーターのインスタンスを作成するため
from ..database import crud, schemas, models
from ..auth.token import create_accecss_token, get_current_user
from ..database.database import get_db
from ..auth .passwordService import verify_password
from ..services import chat_service
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from datetime import datetime, timedelta

# ルータのインスタンスを作成
router = APIRouter(prefix="/users")

# post_ai_answerで使用する 会話履歴を保持する辞書
chat_histories = {}

# ユーザー登録
@router.post("/registration", response_model=schemas.UserResponse)  # ハッシュ化されたパスワードなどを除外してJSON形式でレスポンスを返す
async def registration_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 重複チェック
    db_user = crud.get_user_by_user_id(db, user_id=user.user_id)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="このユーザーIDは既に使用されています"
        )
    print("登録APIが呼び出されました")
    print(f"受け取ったデータ: user_id={user.user_id} password={user.password}")
    # ユーザー作成
    return crud.create_user(db=db, user=user)

# ユーザーログイン
@router.post("/login")
async def login_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # ユーザー情報の取得
    db_user = crud.get_user_by_user_id(db=db, user_id=user.user_id)
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="ユーザーIDまたはパスワードが正しくありません"
        )
    # パスワードの検証
    if not verify_password(plain_password=user.password, hashed_password=db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="ユーザーIDまたはパスワードが正しくありません"
        )
    # トークンの生成
    access_token = create_accecss_token(data={"sub": user.user_id})
    
    print("ログインAPIが呼び出されました")
    print(f"受け取ったデータ: user_id={user.user_id} password={user.password}")
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
    # print("hospitalメモ:",memos)
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
    # print("weightメモ:",memos)
    return memos

# AIへの質問
@router.post("/question")
async def post_ai_answer(
    question_content: schemas.QuestionContent,
    current_user: models.User = Depends(get_current_user),
):
    user_id = current_user.user_id
    user_message = question_content.user_input
    current_time = datetime.now()

    history = []
    created_at = current_time

    # ユーザーの会話履歴を取得
    if user_id in chat_histories:
        user_data = chat_histories[user_id]
        # 作成日時から1日以内の場合、履歴と日時を引き継ぐ
        if current_time - user_data["created_at"] <= timedelta(days=1):
            history = user_data["history"]
            created_at = user_data["created_at"]
    
    try:
        # Geminiの回答と更新された会話履歴の取得
        final_answer, updated_history_parts = await chat_service.handle_conversation(user_message, history)
        # 会話履歴の辞書を更新
        new_hitory = history + updated_history_parts
        chat_histories[user_id] = {
            "history": new_hitory,
            "created_at": created_at
        }
        # 最終回答を返す
        return final_answer
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        if user_id in chat_histories:
            del chat_histories[user_id]
        raise HTTPException(status_code=500, detail=f"AIとの対話中にエラーが発生しました")