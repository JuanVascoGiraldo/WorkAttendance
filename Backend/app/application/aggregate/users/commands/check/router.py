from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.dependencies import get_dependency
from app.infrastructure.inyections import get_utc_timestamp

from .handler import Handler
from .request import Request
from .response import Response

router = APIRouter()


@router.post("/{user_id}/check", response_model=Response, status_code=status.HTTP_200_OK)
async def check(
    user_id: UUID,
    request: Request,
    timestamp: datetime = Depends(get_utc_timestamp),
):
    handler: Handler = get_dependency(Handler)
    return await handler.handle(user_id, request, timestamp)
