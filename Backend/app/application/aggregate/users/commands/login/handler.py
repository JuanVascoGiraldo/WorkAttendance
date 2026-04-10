from logging import Logger

from app.domain.exceptions import InvalidEmployeeNumberException, UserNotFoundException
from app.domain.repositories import UserRepository

from .request import Request
from .response import Response


class Handler:
    def __init__(self, logger: Logger, repository: UserRepository) -> None:
        self.logger = logger
        self.repository = repository

    async def handle(self, command: Request) -> Response:
        self.logger.info("Login attempt by email")
        user = await self.repository.get_user_by_email(command.email)
        if user is None:
            raise UserNotFoundException(command.email)

        if not user.verify_employee_number(command.employee_number):
            raise InvalidEmployeeNumberException()

        return Response(success=True, user_id=user.id)
