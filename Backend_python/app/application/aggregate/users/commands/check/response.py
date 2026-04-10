from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class Response(BaseModel):
    success: bool
    user_id: UUID
    type: int
    timestamp: datetime
