from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now()
    )  # SQLiteを使っているのでtimezone=Trueは削除
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        onupdate=func.now()
    ) # 同じ理由でtimezone=Trueは削除
    memos: Mapped["Memo"] = relationship("Memo", back_populates="user")

class Memo(Base):
    __tablename__ = "memos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    year: Mapped[int]
    month: Mapped[int]
    day: Mapped[int]
    meal: Mapped[str] = mapped_column(default="", nullable=False)
    exercise: Mapped[str] = mapped_column(default="", nullable=False)
    hospital: Mapped[str] = mapped_column(default="", nullable=False)
    other: Mapped[str] = mapped_column(default="", nullable=False)
    weight: Mapped[str] = mapped_column(default="", nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="memos")