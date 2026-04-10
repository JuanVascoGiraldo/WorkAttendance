from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date, timezone
from pytz import timezone as pytz_timezone
from typing import Optional
from .check_type import CheckType
from .attendance_status import AttendanceStatus
from app.domain.aggregate.constants import out_hour, timezone_str
from app.domain.exceptions.check_out_before_check_in import CheckOutBeforeCheckInException

class WorkAttendance(BaseModel):
    id: UUID
    attendance_date: date
    check_in_time: datetime
    check_out_time: Optional[datetime] = None
    status : Optional[AttendanceStatus] = AttendanceStatus.OPEN
    created_at: datetime
    updated_at: datetime

    def set_check(self, timestamp: datetime, check_type: CheckType):
        if check_type == CheckType.OUT:
            if timestamp < self.check_in_time:
                raise CheckOutBeforeCheckInException()
            self.check_out_time = timestamp
        if self.check_in_time and self.check_out_time and self.status == AttendanceStatus.OPEN:
            self.status = AttendanceStatus.COMPLETE
        self.updated_at = datetime.now(timezone.utc)

    @staticmethod
    def _format_seconds(total_seconds: float) -> str:
        seconds = max(0, int(total_seconds))
        hours, remainder = divmod(seconds, 3600)
        minutes, secs = divmod(remainder, 60)
        return f"{hours:02}:{minutes:02}:{secs:02}"

    def get_work_duration(self, timestamp: datetime) -> str:
        if self.status in [AttendanceStatus.ABSENT]:
            return "00:00:00"
        # breakpoint()
        if self.check_in_time and self.check_out_time:
            return self._format_seconds(
                (self.check_out_time - self.check_in_time).total_seconds()
            )
        
        if timestamp.date() == self.attendance_date:
            return self._format_seconds((timestamp - self.check_in_time).total_seconds())

        return self._format_seconds((
            datetime.combine(
                self.attendance_date,
                datetime.strptime(out_hour, "%H:%M:%S").time(),
                tzinfo=pytz_timezone(timezone_str)).astimezone(timezone.utc) - self.check_in_time
        ).total_seconds())
