from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    create_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), timezorn=True
    )
    updated_at = Mapped[datetime] = mapped_column(
        onupdate=func.now(), timezorn=True
    )