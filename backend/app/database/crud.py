from sqlalchemy.orm import Session
from . import models, schemas
from ..auth.passwordService import get_hashed_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_hashed_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_memo(db: Session, user_id: int, year: int, month: int, day: int):
    return db.query(models.Memo).filter_by(
        user_id=user_id, year=year, month=month, day=day
        ).first()

def create_or_update_memo(db: Session, user_id: int, memo: schemas.MemoCreate):
    db_memo = get_user_memo(db, user_id, memo.year, memo.month, memo.day)
    if db_memo:
        db_memo.meal = memo.meal
        db_memo.exercise = memo.exercise
        db_memo.hospital = memo.hospital
        db_memo.other = memo.other
        db_memo.weight = memo.weight
    else:
        db_memo = models.Memo(
            user_id=user_id,
            year=memo.year,
            month=memo.month,
            day=memo.day,
            meal=memo.meal,
            exercise=memo.exercise,
            hospital=memo.hospital,
            other=memo.other,
            weight=memo.weight
        )
        db.add(db_memo)
    db.commit()
    db.refresh(db_memo)
    return db_memo