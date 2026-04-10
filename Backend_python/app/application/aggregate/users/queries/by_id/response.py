from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.domain.aggregate.users import Area, Role


class UserData(BaseModel):
    id: UUID
    employee_number: str
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    role: Role
    areas: list[Area]
    supervisor_id: UUID | None = None
    created_at: datetime
    updated_at: datetime
    attendance_status: int
    work_hours: str

class Response(BaseModel):
    user: UserData
