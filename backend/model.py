# backend/models.py

from pydantic import BaseModel

class Book(BaseModel):
    id   : int
    title: str
    state: str  # 'to-read', 'in-progress', 'completed'
