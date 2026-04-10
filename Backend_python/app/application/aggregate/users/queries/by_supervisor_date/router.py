from datetime import date, datetime
from uuid import UUID

from fastapi import APIRouter, Query, status, Depends

from app.infrastructure.inyections import get_utc_timestamp
from app.dependencies import get_dependency

from .handler import Handler
from .response import Response

router = APIRouter()


@router.get(
    "/by-supervisor/{supervisor_id}",
    response_model=Response,
    status_code=status.HTTP_200_OK,
)
async def get_users_by_supervisor_and_date(
    supervisor_id: UUID,
    date_value: date = Query(..., alias="date"),
     timestamp: datetime = Depends(get_utc_timestamp)
):
    handler: Handler = get_dependency(Handler)
    return await handler.handle(supervisor_id, date_value, timestamp)
