from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import time
from api import models, schemas, database
from typing import Dict

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_HEARTS = 5
HEART_REFILL_MINUTES = 30

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def today_key():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")

def days_between(a: str, b: str) -> int:
    try:
        da = datetime.strptime(a, "%Y-%m-%d")
        db = datetime.strptime(b, "%Y-%m-%d")
        return (db - da).days
    except ValueError:
        return 1

def tick_hearts(user: models.User):
    if user.hearts >= MAX_HEARTS:
        return
    now_ms = int(time.time() * 1000)
    elapsed_min = (now_ms - user.hearts_updated_at) / 60000
    gained = int(elapsed_min // HEART_REFILL_MINUTES)
    if gained > 0:
        new_hearts = min(MAX_HEARTS, user.hearts + gained)
        user.hearts = new_hearts
        user.hearts_updated_at = int(user.hearts_updated_at + gained * HEART_REFILL_MINUTES * 60000)

def bump_daily_streak(user: models.User):
    today = today_key()
    if user.last_active_date == today:
        return
    gap = days_between(user.last_active_date, today) if user.last_active_date else 1
    new_streak = user.streak + 1 if gap == 1 else 1
    user.streak = new_streak
    user.today_xp = user.today_xp if user.last_active_date == today else 0
    user.last_active_date = today

def get_or_create_user(db: Session) -> models.User:
    user = db.query(models.User).first()
    if not user:
        user = models.User(joined=datetime.now(timezone.utc).isoformat())
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        tick_hearts(user)
        db.commit()
    return user

def build_learner_state(user: models.User) -> dict:
    progress_dict = {}
    for p in user.progress:
        progress_dict[p.skill_id] = {
            "lessonsCompleted": p.lessons_completed,
            "crown": p.crown
        }
    
    return {
        "name": user.name,
        "avatar": user.avatar,
        "joined": user.joined,
        "xp": user.xp,
        "streak": user.streak,
        "gems": user.gems,
        "hearts": user.hearts,
        "heartsUpdatedAt": user.hearts_updated_at,
        "lastActiveDate": user.last_active_date,
        "todayXp": user.today_xp,
        "progress": progress_dict
    }

@app.get("/api/learner", response_model=schemas.LearnerState)
def read_learner(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    return build_learner_state(user)

@app.post("/api/learner/xp", response_model=schemas.LearnerState)
def gain_xp(req: schemas.XpRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    user.xp += req.amount
    user.today_xp += req.amount
    db.commit()
    db.refresh(user)
    return build_learner_state(user)

@app.post("/api/learner/heart/lose", response_model=schemas.LearnerState)
def lose_heart(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    if user.hearts == MAX_HEARTS:
        user.hearts_updated_at = int(time.time() * 1000)
    user.hearts = max(0, user.hearts - 1)
    db.commit()
    db.refresh(user)
    return build_learner_state(user)

@app.post("/api/learner/heart/refill", response_model=schemas.LearnerState)
def refill_hearts(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    cost = 350
    if user.hearts >= MAX_HEARTS or user.gems < cost:
        raise HTTPException(status_code=400, detail="Cannot refill hearts")
    
    user.hearts = MAX_HEARTS
    user.gems -= cost
    user.hearts_updated_at = int(time.time() * 1000)
    db.commit()
    db.refresh(user)
    return build_learner_state(user)

@app.post("/api/learner/lesson/complete", response_model=schemas.LearnerState)
def complete_lesson(req: schemas.LessonCompleteRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    bump_daily_streak(user)
    
    user.xp += req.xpEarned
    user.today_xp += req.xpEarned
    
    skill_prog = db.query(models.SkillProgress).filter(
        models.SkillProgress.user_id == user.id,
        models.SkillProgress.skill_id == req.skillId
    ).first()
    
    if not skill_prog:
        skill_prog = models.SkillProgress(
            user_id=user.id,
            skill_id=req.skillId,
            lessons_completed=req.lessonsCompleted,
            crown=req.crown
        )
        db.add(skill_prog)
    else:
        skill_prog.lessons_completed = req.lessonsCompleted
        skill_prog.crown = req.crown
        
    db.commit()
    db.refresh(user)
    return build_learner_state(user)
