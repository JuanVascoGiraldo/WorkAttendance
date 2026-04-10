from .base_domain_exception import BaseDomainException


class CheckOutWithoutCheckInException(BaseDomainException):
    def __init__(self) -> None:
        super().__init__(
            message="Cannot check out because check in was not registered.",
            response_code=400,
            name="check_out_without_check_in",
        )
