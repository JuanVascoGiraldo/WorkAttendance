from pydantic import BaseModel
from pydantic import EmailStr
from uuid import UUID
from app.domain.aggregate.users import Area


class UserSummary(BaseModel):
    id: UUID
    full_name: str
    first_name: str
    last_name: str
    email: EmailStr
    employee_number: str
    role: int
    areas: list[Area]
    is_active: bool
    supervisor_id: UUID | None = None


class Response(BaseModel):
    users: list[UserSummary]
