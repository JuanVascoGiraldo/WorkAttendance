from app.domain.aggregate.users import CheckType
from pydantic import BaseModel



class Request(BaseModel):
    type: CheckType
