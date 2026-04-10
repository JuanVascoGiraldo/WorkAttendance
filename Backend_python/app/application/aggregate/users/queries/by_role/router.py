from fastapi import APIRouter, status

from app.dependencies import get_dependency
from app.domain.aggregate.users import Role

from .handler import Handler
from .response import Response

router = APIRouter()


@router.get("/by-role/{role}", response_model=Response, status_code=status.HTTP_200_OK)
async def get_users_by_role(role: Role):
    handler: Handler = get_dependency(Handler)
    return await handler.handle(role)
