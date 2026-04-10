from uuid import UUID

from app.domain.exceptions import UserNotFoundException
from app.domain.repositories import UserRepository
from app.domain.aggregate.users import AttendanceStatus
from .response import Response, UserData
from datetime import datetime
from logging import Logger

class Handler:
    def __init__(self, repository: UserRepository, logger: Logger) -> None:
        self.repository = repository
        self.logger = logger

    async def handle(self, user_id: UUID, timestamp: datetime) -> Response:
        self.logger.info(f"Handling get user by id query for user_id: {user_id} - timestamp: {timestamp}")
        user = await self.repository.get_user_by_id(user_id)
        if user is None:
            raise UserNotFoundException(str(user_id))
        attendance = await self.repository.get_work_attendance(user_id, str(timestamp.date()))
        return Response(
            user=UserData(
                id=user.id,
                employee_number=user.employee_number,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                is_active=user.is_active,
                role=user.role,
                areas=user.areas,
                supervisor_id=user.supervisor_id,
                created_at=user.created_at,
                updated_at=user.updated_at,
                attendance_status=(
                    attendance.status.value
                    if attendance and attendance.status is not None
                    else AttendanceStatus.ABSENT.value
                ),
                work_hours=attendance.get_work_duration(timestamp) if attendance else "00:00:00"
            )
        )
