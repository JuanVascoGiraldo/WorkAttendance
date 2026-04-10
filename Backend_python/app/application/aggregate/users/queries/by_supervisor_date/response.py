from pydantic import BaseModel
from uuid import UUID
from app.domain.aggregate.users import Area


class UserSummary(BaseModel):
    id: UUID
    full_name: str
    areas: list[Area]
    employee_number: str
    attendance_status: int
    work_hours: str

class Response(BaseModel):
    users: list[UserSummary]
