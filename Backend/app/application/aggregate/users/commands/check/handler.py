from datetime import datetime, timedelta, timezone
from logging import Logger
from uuid import UUID, uuid4

from app.domain.aggregate.users.check_type import CheckType
from app.domain.aggregate.users import WorkAttendance, AttendanceStatus
from app.domain.aggregate.constants import (
    in_hour, max_late_minutes, max_absent_minutes, timezone_str)
from app.domain.exceptions import (
    CheckOutWithoutCheckInException,
    UserNotFoundException,
)
from app.domain.repositories import UserRepository
from pytz import timezone as pytz_timezone
from .request import Request
from .response import Response


class Handler:
    def __init__(self, logger: Logger, repository: UserRepository) -> None:
        self.logger = logger
        self.repository = repository
    
    def get_attendance_status(self, timestamp: datetime) -> AttendanceStatus:
        tz = pytz_timezone(timezone_str)
        local_time = timestamp.astimezone(tz)
        in_time = datetime.strptime(in_hour, "%H:%M:%S").time()
        in_time_date = datetime.combine(timestamp.date(), in_time, tzinfo=tz)
        # breakpoint()
    
        if local_time <= (in_time_date + timedelta(minutes=max_late_minutes)):
            return AttendanceStatus.OPEN

        if local_time <= (in_time_date + timedelta(minutes=max_absent_minutes)):
            return AttendanceStatus.LATE

        return AttendanceStatus.ABSENT
        

    async def handle(self, user_id: UUID, command: Request, timestamp: datetime) -> Response:
        user = await self.repository.get_user_by_id(user_id)
        if user is None:
            raise UserNotFoundException(str(user_id))
        

        tz = pytz_timezone(timezone_str)
        local_time = timestamp.astimezone(tz)
        attendance = await self.repository.get_work_attendance(user_id, str(local_time.date()))

        if attendance is None and command.type == CheckType.IN:
            attendance = WorkAttendance(
                id=uuid4(),
                attendance_date=local_time.date(),
                check_in_time=timestamp,
                check_out_time=None,
                status=self.get_attendance_status(timestamp),
                created_at=timestamp,
                updated_at=timestamp,
            )
    
        if attendance is None:
            raise CheckOutWithoutCheckInException()

        if attendance.check_in_time and attendance.check_out_time:
            return Response(
                success=False,
                user_id=user_id,
                type=command.type.value,
                timestamp=timestamp_utc
            )

        if command.type == CheckType.OUT and not attendance.check_in_time:
            raise CheckOutWithoutCheckInException()

        attendance.set_check(timestamp_utc, command.type)
        attendance.updated_at = datetime.now(timezone.utc)
        await self.repository.upsert_work_attendance(user_id, attendance)

        return Response(
            success=True,
            user_id=user_id,
            type=command.type.value,
            timestamp=timestamp_utc,
        )
