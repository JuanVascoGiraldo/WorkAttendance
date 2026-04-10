from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import List, Optional
from datetime import datetime, date

from .role import Role
from .area import Area
from .work_attendance import WorkAttendance


class User(BaseModel):
    
    id: UUID
    employee_number: str
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    role: Role
    areas: List[Area]
    supervisor_id: Optional[UUID] = None
    work_attendances: List[WorkAttendance]
    created_at: datetime
    updated_at: datetime
    
    def verify_employee_number(self, employee_number: str) -> bool:
        return self.employee_number == employee_number

    def get_attendance_by_date(self, attendance_date: date) -> Optional[WorkAttendance]:
        return next((a for a in self.work_attendances if a.attendance_date == attendance_date), None)

    
