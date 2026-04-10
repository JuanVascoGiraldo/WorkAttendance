from fastapi import APIRouter
from . import check
from . import create
from . import login
from . import update


router = APIRouter(tags=["user-commands"])
router.include_router(check.router)
router.include_router(create.router)
router.include_router(login.router)
router.include_router(update.router)
