from .base_domain_exception import BaseDomainException


class CheckOutBeforeCheckInException(BaseDomainException):
    def __init__(self) -> None:
        super().__init__(
            message="Cannot check out with a time earlier than check in.",
            response_code=400,
            name="check_out_before_check_in",
        )
