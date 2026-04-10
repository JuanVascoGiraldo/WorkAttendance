from app.domain.aggregate.users import Role
from app.domain.repositories import UserRepository

from .response import Response, UserSummary


class Handler:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def handle(self, role: Role) -> Response:
        users = await self.repository.get_users_by_role(role)
        items = [
            UserSummary(
                id=user.id,
                full_name=f"{user.first_name} {user.last_name}",
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                employee_number=user.employee_number,
                role=int(user.role),
                areas=user.areas,
                is_active=user.is_active,
                supervisor_id=user.supervisor_id,
            )
            for user in users
        ]
        return Response(users=items)
