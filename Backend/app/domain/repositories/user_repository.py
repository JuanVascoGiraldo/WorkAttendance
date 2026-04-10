from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from app.domain.aggregate.users.role import Role
from app.domain.aggregate.users import User, WorkAttendance

class UserRepository(ABC):
    
    @abstractmethod
    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        pass

    @abstractmethod
    async def get_user_by_employee_number(self, employee_number: str) -> Optional[User]:
        pass

    @abstractmethod
    async def get_user_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    async def get_users_by_supervisor_id(self, supervisor_id: UUID) -> List[User]:
        pass

    @abstractmethod
    async def get_users(self) -> List[User]:
        pass

    @abstractmethod
    async def get_users_by_role(self, role: Role) -> List[User]:
        pass

    @abstractmethod
    async def create_user(self, user: User) -> None:
        pass

    @abstractmethod
    async def update_user(self, user: User) -> None:
        pass

    @abstractmethod
    async def delete_user(self, user_id: UUID) -> None:
        pass

    @abstractmethod
    async def add_work_attendance(self, user_id: UUID, attendance: WorkAttendance) -> None:
        pass

    @abstractmethod
    async def get_work_attendance(self, user_id: UUID, date: str) -> Optional[WorkAttendance]:
        pass

    @abstractmethod
    async def upsert_work_attendance(self, user_id: UUID, attendance: WorkAttendance) -> None:
        pass
