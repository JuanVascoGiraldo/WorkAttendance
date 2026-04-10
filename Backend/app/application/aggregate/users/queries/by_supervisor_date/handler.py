from datetime import date, datetime
from uuid import UUID

from app.domain.repositories import UserRepository
from app.domain.aggregate.users import AttendanceStatus, User
from .response import Response, UserSummary

class Handler:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository
    
    async def to_user_summary(self, user: User, work_d: date, timestamp: datetime) -> UserSummary:
        attendance = await self.repository.get_work_attendance(user.id, str(work_d))
        return UserSummary(
            id=user.id,
            full_name=f"{user.first_name} {user.last_name}",
            areas=user.areas,
            employee_number=user.employee_number,
            attendance_status=(
                attendance.status.value
                if attendance and attendance.status is not None
                else AttendanceStatus.ABSENT.value
            ),
            work_hours=attendance.get_work_duration(timestamp) if attendance else "00:00:00"
        )

    async def handle(self, supervisor_id: UUID, work_date: date, timestamp: datetime) -> Response:
        users = await self.repository.get_users_by_supervisor_id(supervisor_id)
        items = [
            await self.to_user_summary(user, work_date, timestamp)
            for user in users
        ]
        return Response(users=items)
