from logging import Logger
from .request import Request
from .response import Response
from app.domain.exceptions import (
    EmailAlreadyExistsException, EmployeeNumberAlreadyExistsException,
)
from app.domain.repositories import UserRepository
from app.domain.aggregate.users import User
from uuid import uuid4
from datetime import datetime, timezone

class Handler():

    def __init__(
        self,
        logger: Logger,
        repository: UserRepository
    ) -> None:
        self.logger = logger
        self.repository = repository

    async def handle(self, command: Request) -> Response:
        self.logger.info("Creating user")
        self.logger.info("Checking if email already exists")
        if await self.repository.get_user_by_email(command.email):
            self.logger.warning("Email already exists")
            raise EmailAlreadyExistsException(command.email)
        
        if await self.repository.get_user_by_employee_number(command.employee_number):
            self.logger.warning("Employee number already exists")
            raise EmployeeNumberAlreadyExistsException(command.employee_number)
        
        self.logger.info("Creating user")

        user = User(
            id=uuid4(),
            first_name=command.first_name,
            last_name=command.last_name,
            email=command.email,
            employee_number=command.employee_number,
            role=command.role,
            supervisor_id=command.supervisor_id,
            is_active=True,
            areas=command.areas,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            work_attendances=[]
        )
        await self.repository.create_user(user)
        
        return Response(
            success=True,
            user_id=user.id
        )
