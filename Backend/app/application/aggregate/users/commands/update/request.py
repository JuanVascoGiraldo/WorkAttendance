from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID

from app.domain.aggregate.users import Area, Role


class Request(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    employee_number: Optional[str] = None
    role: Optional[Role] = None
    areas: Optional[list[Area]] = Field(default=None, min_length=1)
    supervisor_id: Optional[UUID] = None
    is_active: Optional[bool] = None
