from datetime import datetime, timezone
from logging import Logger
from uuid import UUID

from app.domain.aggregate.users import User
from app.domain.exceptions import (
    EmailAlreadyExistsException,
    EmployeeNumberAlreadyExistsException,
    UserNotFoundException,
)
from app.domain.repositories import UserRepository

from .request import Request
from .response import Response


class Handler:
    def __init__(self, logger: Logger, repository: UserRepository) -> None:
        self.logger = logger
        self.repository = repository

    async def handle(self, user_id: UUID, command: Request) -> Response:
        current_user = await self.repository.get_user_by_id(user_id)
        if current_user is None:
            raise UserNotFoundException(str(user_id))

        if command.email is not None and command.email != current_user.email:
            existing_by_email = await self.repository.get_user_by_email(command.email)
            if existing_by_email and existing_by_email.id != user_id:
                raise EmailAlreadyExistsException(command.email)

        if (
            command.employee_number is not None
            and command.employee_number != current_user.employee_number
        ):
            existing_by_number = await self.repository.get_user_by_employee_number(
                command.employee_number
            )
            if existing_by_number and existing_by_number.id != user_id:
                raise EmployeeNumberAlreadyExistsException(command.employee_number)

        updated_user = User(
            id=current_user.id,
            employee_number=command.employee_number or current_user.employee_number,
            first_name=command.first_name or current_user.first_name,
            last_name=command.last_name or current_user.last_name,
            email=command.email or current_user.email,
            is_active=(
                command.is_active if command.is_active is not None else current_user.is_active
            ),
            role=command.role or current_user.role,
            areas=command.areas if command.areas is not None else current_user.areas,
            supervisor_id=(
                command.supervisor_id
                if command.supervisor_id is not None
                else current_user.supervisor_id
            ),
            work_attendances=current_user.work_attendances,
            created_at=current_user.created_at,
            updated_at=datetime.now(timezone.utc),
        )

        await self.repository.update_user(updated_user)

        return Response(success=True, user_id=updated_user.id)
