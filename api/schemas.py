from pydantic import BaseModel
from typing import Dict, List, Optional

class SkillProgressBase(BaseModel):
    lessonsCompleted: int
    crown: int

class SkillProgressCreate(SkillProgressBase):
    skill_id: str

class SkillProgress(SkillProgressBase):
    id: int
    user_id: int
    skill_id: str

    class Config:
        orm_mode = True

class LearnerStateBase(BaseModel):
    name: str
    avatar: str
    joined: str
    xp: int
    streak: int
    gems: int
    hearts: int
    heartsUpdatedAt: int
    lastActiveDate: str
    todayXp: int

class LearnerState(LearnerStateBase):
    progress: Dict[str, SkillProgressBase]

    class Config:
        orm_mode = True

class XpRequest(BaseModel):
    amount: int

class LessonCompleteRequest(BaseModel):
    xpEarned: int
    skillId: str
    lessonsCompleted: int
    crown: int
