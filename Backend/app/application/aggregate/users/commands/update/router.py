from uuid import UUID

from fastapi import APIRouter, status

from app.dependencies import get_dependency

from .handler import Handler
from .request import Request
from .response import Response

router = APIRouter()


@router.put("/{user_id}", response_model=Response, status_code=status.HTTP_200_OK)
async def update(user_id: UUID, request: Request):
    handler: Handler = get_dependency(Handler)
    return await handler.handle(user_id, request)
