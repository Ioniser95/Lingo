from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import time

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="You")
    avatar = Column(String, default="🐤")
    joined = Column(String)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    gems = Column(Integer, default=500)
    hearts = Column(Integer, default=5)
    hearts_updated_at = Column(Integer, default=lambda: int(time.time() * 1000))
    last_active_date = Column(String, default="")
    today_xp = Column(Integer, default=0)

    progress = relationship("SkillProgress", back_populates="user", cascade="all, delete-orphan")

class SkillProgress(Base):
    __tablename__ = "skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(String, index=True)
    lessons_completed = Column(Integer, default=0)
    crown = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")
