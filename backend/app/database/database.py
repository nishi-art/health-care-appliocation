from sqlalchemy import create_engine   # SQLAlchemyでデータベース接続を確立するための関数create_engineを使うため
from sqlalchemy.orm import DeclarativeBase   # SQLAlchemyのORMモデルを作成するための基底クラスを生成する関数を使うため
from sqlalchemy.orm import sessionmaker   # データベースセッションを作成するためのファクトリクラス
from . import models

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# SQLiteとPythonプログラムを接続し管理するためのデータベースエンジンをエンジンオブジェクトとして作成
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
# データベースセッション（インスタンス）を作成するためのファクトリを定義
# 左から　トランザクションを手動で制御するため, セッションの変更を手動で制御するため, 作成したエンジンとセッションを関連付け（どのデータベースに接続するかを指定）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()  # セッションの開始
    try:
        yield db  # セッションを一時的に渡す（HTTPリクエストの処理中だけセッションが有効になる）
    finally:
        db.close()  # セッションの終了