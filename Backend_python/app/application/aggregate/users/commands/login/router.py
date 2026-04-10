from fastapi import APIRouter, status

from app.dependencies import get_dependency

from .handler import Handler
from .request import Request
from .response import Response

router = APIRouter()


@router.post("/login", response_model=Response, status_code=status.HTTP_200_OK)
async def login(request: Request):
    handler: Handler = get_dependency(Handler)
    return await handler.handle(request)
