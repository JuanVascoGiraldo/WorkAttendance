from .base_domain_exception import BaseDomainException


class InvalidEmployeeNumberException(BaseDomainException):
    def __init__(self) -> None:
        super().__init__(
            message="Invalid employee number for this email.",
            response_code=401,
            name="invalid_employee_number",
        )
