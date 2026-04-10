from .base_domain_exception import BaseDomainException


class EmployeeNumberAlreadyExistsException(BaseDomainException):
    
    def __init__(self, employee_number: str) -> None:
        super().__init__(
            message=f"The employee number '{employee_number}' is already registered.",
            response_code=400,
            name="employee_number_already_exists"
        )
