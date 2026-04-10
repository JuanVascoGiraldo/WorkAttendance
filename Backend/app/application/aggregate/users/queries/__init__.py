from fastapi import APIRouter
from . import by_id
from . import by_role
from . import by_supervisor_date



router = APIRouter(tags=["user-queries"])
router.include_router(by_id.router)
router.include_router(by_role.router)
router.include_router(by_supervisor_date.router)

