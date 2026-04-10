from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import EmailStr, Field

from app.infrastructure.persistance.mongodb.dao.work_attendance_dao import WorkAttendanceDao

from .base_dao import BaseDao


USER_PK_INDEX = "USER#"
USER_SK_INDEX = "PROFILE#"


class UserDao(BaseDao):
    """Defines how User is stored in Mongo using PK/SK."""

    PK: ClassVar[str] = USER_PK_INDEX
    SK: ClassVar[str] = USER_SK_INDEX

    id: UUID
    employee_number: str
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    role: int
    areas: list[int] = Field(default_factory=list)
    supervisor_id: UUID | None = None
    work_attendances: list[WorkAttendanceDao] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    def build_pk(self) -> str:
        return f"{self.PK}{self.id}"

    def build_sk(self) -> str:
        return f"{self.SK}"

