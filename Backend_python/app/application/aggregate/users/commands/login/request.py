from pydantic import BaseModel, EmailStr


class Request(BaseModel):
    email: EmailStr
    employee_number: str
