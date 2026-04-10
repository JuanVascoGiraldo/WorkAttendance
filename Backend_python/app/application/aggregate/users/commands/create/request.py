from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from app.domain.aggregate.users import Area, Role

class Request(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    employee_number: str
    role: Role
    areas: list[Area] = Field(min_length=1)
    supervisor_id: Optional[UUID] = None
    