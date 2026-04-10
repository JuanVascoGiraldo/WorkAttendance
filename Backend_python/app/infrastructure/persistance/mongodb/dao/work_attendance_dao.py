from __future__ import annotations

from datetime import datetime, date
from typing import ClassVar
from uuid import UUID

from app.domain.aggregate.users import AttendanceStatus

from .base_dao import BaseDao


WORK_ATTENDANCE_PK_INDEX = "USER#"
WORK_ATTENDANCE_SK_INDEX = "ATTENDANCE#"


class WorkAttendanceDao(BaseDao):
    """Defines how WorkAttendance is stored in Mongo using PK/SK."""

    PK: ClassVar[str] = WORK_ATTENDANCE_PK_INDEX
    SK: ClassVar[str] = WORK_ATTENDANCE_SK_INDEX

    id: UUID
    user_id: UUID
    attendance_date: date
    check_in_time: datetime
    check_out_time: datetime | None = None
    status: AttendanceStatus | None = AttendanceStatus.OPEN
    created_at: datetime
    updated_at: datetime

    def build_pk(self) -> str:
        return f"{self.PK}{self.user_id}"

    def build_sk(self) -> str:
        return f"{self.SK}{self.attendance_date}"

