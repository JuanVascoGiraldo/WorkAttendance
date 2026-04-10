from pydantic import BaseModel
from uuid import UUID


class Response(BaseModel):
    success: bool
    user_id: UUID
