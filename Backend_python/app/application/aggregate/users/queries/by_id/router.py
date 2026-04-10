from uuid import UUID

from fastapi import APIRouter, status, Depends

from app.dependencies import get_dependency
from app.infrastructure.inyections import get_utc_timestamp

from .handler import Handler
from .response import Response
from datetime import datetime

router = APIRouter()


@router.get("/{user_id}", response_model=Response, status_code=status.HTTP_200_OK)
async def get_user_by_id(user_id: UUID, timestamp: datetime = Depends(get_utc_timestamp)):
    handler: Handler = get_dependency(Handler)
    return await handler.handle(user_id, timestamp)
