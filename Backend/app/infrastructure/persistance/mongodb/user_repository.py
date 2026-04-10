

from typing import Optional, List
from uuid import UUID
from app.domain.aggregate.users.area import Area
from app.domain.aggregate.users.role import Role
from app.infrastructure.persistance.mongodb.dao import UserDao, WorkAttendanceDao, IndexDao
from app.config import Config
from app.domain.aggregate.users import User, WorkAttendance
from app.domain.repositories import UserRepository
from app.infrastructure.persistance.mongodb.clients import MongoClient
from app.infrastructure.persistance.mongodb.mappers.user import (
    from_user_dao_to_user,
    from_user_to_user_dao,
    from_work_attendance_dao_to_work_attendance,
    from_work_attendance_to_work_attendance_dao,
)


class UserRepositoryImpl(UserRepository):
    USERS_COLLECTION = "users"
    INDEX_COLLECTION = "indexes"
    SUPERVISOR_PK_PREFIX = "SUPERVISOR#"
    EMPLOYEE_NUMBER_PK_PREFIX = "EMPLOYEE_NUMBER#"
    EMAIL_PK_PREFIX = "EMAIL#"
    SUPERVISOR_USER_SK_PREFIX = "USER#"

    def __init__(self, mongo_client: MongoClient, config: Config) -> None:
        self.mongo_client = mongo_client
        self.config = config

    @staticmethod
    def _user_index(user_id: UUID) -> IndexDao:
        return IndexDao(pk=f"{UserDao.PK}{user_id}", sk=UserDao.SK)

    @classmethod
    def _supervisor_user_index(cls, supervisor_id: UUID, user_id: UUID) -> IndexDao:
        return IndexDao(
            pk=f"{cls.SUPERVISOR_PK_PREFIX}{supervisor_id}",
            sk=f"{cls.SUPERVISOR_USER_SK_PREFIX}{user_id}",
        )

    @classmethod
    def _supervisor_pk(cls, supervisor_id: UUID) -> str:
        return f"{cls.SUPERVISOR_PK_PREFIX}{supervisor_id}"

    @classmethod
    def _employee_number_index(cls, employee_number: str, user_id: UUID) -> IndexDao:
        return IndexDao(
            pk=f"{cls.EMPLOYEE_NUMBER_PK_PREFIX}{employee_number}",
            sk=f"{cls.SUPERVISOR_USER_SK_PREFIX}{user_id}",
        )

    @classmethod
    def _email_index(cls, email: str, user_id: UUID) -> IndexDao:
        return IndexDao(
            pk=f"{cls.EMAIL_PK_PREFIX}{email.lower()}",
            sk=f"{cls.SUPERVISOR_USER_SK_PREFIX}{user_id}",
        )

    @classmethod
    def _employee_number_pk(cls, employee_number: str) -> str:
        return f"{cls.EMPLOYEE_NUMBER_PK_PREFIX}{employee_number}"

    @classmethod
    def _email_pk(cls, email: str) -> str:
        return f"{cls.EMAIL_PK_PREFIX}{email.lower()}"

    @classmethod
    def _parse_user_id_from_index_sk(cls, sk: str) -> UUID | None:
        if not sk.startswith(cls.SUPERVISOR_USER_SK_PREFIX):
            return None
        value = sk.replace(cls.SUPERVISOR_USER_SK_PREFIX, "", 1)
        try:
            return UUID(value)
        except ValueError:
            return None

    @staticmethod
    def _to_user(document: dict) -> User:
        raw_areas = document.get("areas")
        if raw_areas is None:
            raw_areas = []

        if not raw_areas and document.get("area"):
            # Backward compatibility for old documents with single "area" field.
            raw_areas = [document.get("area")]

        areas: list[int] = []
        for item in raw_areas:
            try:
                if isinstance(item, Area):
                    areas.append(int(item))
                elif isinstance(item, int):
                    areas.append(item)
            except (TypeError, ValueError):
                continue

        user_dao_dict = {
            "id": document.get("id"),
            "employee_number": document.get("employee_number"),
            "first_name": document.get("first_name"),
            "last_name": document.get("last_name"),
            "email": document.get("email"),
            "is_active": document.get("is_active"),
            "role": document.get("role"),
            "areas": areas,
            "supervisor_id": document.get("supervisor_id"),
            "work_attendances": document.get("work_attendances", []),
            "created_at": document.get("created_at"),
            "updated_at": document.get("updated_at"),
        }
        user_dao = UserDao(**user_dao_dict)
        return from_user_dao_to_user(user_dao)

    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        user_index = self._user_index(user_id)
        document = await self.mongo_client.find_one(
            self.USERS_COLLECTION,
            {"pk": user_index.pk, "sk": user_index.sk},
        )
        if document is None:
            return None
        return self._to_user(document)

    async def get_user_by_employee_number(self, employee_number: str) -> Optional[User]:
        index_document = await self.mongo_client.find_one(
            self.INDEX_COLLECTION,
            {"pk": self._employee_number_pk(employee_number)},
        )
        if index_document is None:
            return None

        user_id = self._parse_user_id_from_index_sk(index_document.get("sk", ""))
        if user_id is None:
            return None

        return await self.get_user_by_id(user_id)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        index_document = await self.mongo_client.find_one(
            self.INDEX_COLLECTION,
            {"pk": self._email_pk(email)},
        )
        if index_document is None:
            return None

        user_id = self._parse_user_id_from_index_sk(index_document.get("sk", ""))
        if user_id is None:
            return None

        return await self.get_user_by_id(user_id)

    async def get_users_by_supervisor_id(self, supervisor_id: UUID) -> List[User]:
        supervisor_index_documents = await self.mongo_client.find_many(
            self.INDEX_COLLECTION,
            {"pk": self._supervisor_pk(supervisor_id)},
        )

        supervised_user_ids = [
            self._parse_user_id_from_index_sk(item.get("sk", ""))
            for item in supervisor_index_documents
        ]
        supervised_user_ids = [item for item in supervised_user_ids if item is not None]

        users: list[User] = []
        for user_id in supervised_user_ids:
            user = await self.get_user_by_id(user_id)
            if user is not None:
                users.append(user)

        return users

    async def get_users(self) -> list[User]:
        documents = await self.mongo_client.find_many(
            self.USERS_COLLECTION,
            {"sk": UserDao.SK},
        )
        users = []
        for document in documents:
            users.append(self._to_user(document))
        return users

    async def get_users_by_role(self, role: Role) -> List[User]:
        documents = await self.mongo_client.find_many(
            self.USERS_COLLECTION,
            {"sk": UserDao.SK, "role": int(role)},
        )
        users = []
        for document in documents:
            users.append(self._to_user(document))
        return users

    async def create_user(self, user: User) -> None:
        user_dao = from_user_to_user_dao(user)
        document = user_dao.to_document()
        
        document["entity"] = "USER"
        await self.mongo_client.insert_one(self.USERS_COLLECTION, document)

        if user.supervisor_id is not None:
            supervisor_index = self._supervisor_user_index(user.supervisor_id, user.id)
            supervisor_index_document = supervisor_index.to_document()
            supervisor_index_document["entity"] = "USER_SUPERVISOR_INDEX"
            await self.mongo_client.insert_one(
                self.INDEX_COLLECTION,
                supervisor_index_document,
            )

        employee_index = self._employee_number_index(user.employee_number, user.id)
        employee_index_document = employee_index.to_document()
        employee_index_document["entity"] = "USER_EMPLOYEE_NUMBER_INDEX"
        await self.mongo_client.insert_one(self.INDEX_COLLECTION, employee_index_document)

        email_index = self._email_index(user.email, user.id)
        email_index_document = email_index.to_document()
        email_index_document["entity"] = "USER_EMAIL_INDEX"
        await self.mongo_client.insert_one(self.INDEX_COLLECTION, email_index_document)

    async def update_user(self, user: User) -> None:
        current_user = await self.get_user_by_id(user.id)
        user_dao = from_user_to_user_dao(user)
        update_fields = user_dao.model_dump(mode="json", exclude={"pk", "sk"})
        user_index = self._user_index(user.id)
        await self.mongo_client.update_one(
            self.USERS_COLLECTION,
            {"pk": user_index.pk, "sk": user_index.sk},
            update_fields,
        )

        previous_supervisor_id = current_user.supervisor_id if current_user else None
        new_supervisor_id = user.supervisor_id

        if previous_supervisor_id != new_supervisor_id:
            if previous_supervisor_id is not None:
                previous_index = self._supervisor_user_index(previous_supervisor_id, user.id)
                await self.mongo_client.delete_one(
                    self.INDEX_COLLECTION,
                    {"pk": previous_index.pk, "sk": previous_index.sk},
                )

            if new_supervisor_id is not None:
                new_index = self._supervisor_user_index(new_supervisor_id, user.id)
                new_index_document = new_index.to_document()
                new_index_document["entity"] = "USER_SUPERVISOR_INDEX"
                await self.mongo_client.insert_one(
                    self.INDEX_COLLECTION,
                    new_index_document,
                )

        if current_user and current_user.employee_number != user.employee_number:
            previous_employee_index = self._employee_number_index(
                current_user.employee_number,
                user.id,
            )
            await self.mongo_client.delete_one(
                self.INDEX_COLLECTION,
                {"pk": previous_employee_index.pk, "sk": previous_employee_index.sk},
            )

            new_employee_index = self._employee_number_index(user.employee_number, user.id)
            new_employee_document = new_employee_index.to_document()
            new_employee_document["entity"] = "USER_EMPLOYEE_NUMBER_INDEX"
            await self.mongo_client.insert_one(self.INDEX_COLLECTION, new_employee_document)

        if current_user and current_user.email.lower() != user.email.lower():
            previous_email_index = self._email_index(current_user.email, user.id)
            await self.mongo_client.delete_one(
                self.INDEX_COLLECTION,
                {"pk": previous_email_index.pk, "sk": previous_email_index.sk},
            )

            new_email_index = self._email_index(user.email, user.id)
            new_email_document = new_email_index.to_document()
            new_email_document["entity"] = "USER_EMAIL_INDEX"
            await self.mongo_client.insert_one(self.INDEX_COLLECTION, new_email_document)

    async def delete_user(self, user_id: UUID) -> None:
        current_user = await self.get_user_by_id(user_id)
        user_index = self._user_index(user_id)
        await self.mongo_client.delete_one(
            self.USERS_COLLECTION,
            {"pk": user_index.pk, "sk": user_index.sk},
        )

        if current_user and current_user.supervisor_id is not None:
            supervisor_index = self._supervisor_user_index(current_user.supervisor_id, user_id)
            await self.mongo_client.delete_one(
                self.INDEX_COLLECTION,
                {"pk": supervisor_index.pk, "sk": supervisor_index.sk},
            )

        if current_user:
            employee_index = self._employee_number_index(current_user.employee_number, user_id)
            await self.mongo_client.delete_one(
                self.INDEX_COLLECTION,
                {"pk": employee_index.pk, "sk": employee_index.sk},
            )

            email_index = self._email_index(current_user.email, user_id)
            await self.mongo_client.delete_one(
                self.INDEX_COLLECTION,
                {"pk": email_index.pk, "sk": email_index.sk},
            )

    async def add_work_attendance(
        self,
        user_id: UUID,
        attendance: WorkAttendance,
    ) -> None:
        attendance_dao = from_work_attendance_to_work_attendance_dao(attendance, user_id)
        document = attendance_dao.to_document()
        document["entity"] = "WORK_ATTENDANCE"
        await self.mongo_client.insert_one(self.USERS_COLLECTION, document)

    async def get_work_attendance(
        self,
        user_id: UUID,
        date: str,
    ) -> Optional[WorkAttendance]:
        document = await self.mongo_client.find_one(
            self.USERS_COLLECTION,
            {
                "pk": f"USER#{user_id}",
                "sk": f"ATTENDANCE#{date}",
            },
        )
        if document is None:
            return None
        attendance_dao = WorkAttendanceDao.from_document(document)
        return from_work_attendance_dao_to_work_attendance(attendance_dao)

    async def upsert_work_attendance(self, user_id: UUID, attendance: WorkAttendance) -> None:
        existing = await self.get_work_attendance(user_id, str(attendance.attendance_date))
        if existing is None:
            await self.add_work_attendance(user_id, attendance)
            return

        attendance_dao = from_work_attendance_to_work_attendance_dao(attendance, user_id)
        update_fields = attendance_dao.model_dump(mode="json", exclude={"pk", "sk"})
        await self.mongo_client.update_one(
            self.USERS_COLLECTION,
            {
                "pk": f"USER#{user_id}",
                "sk": f"ATTENDANCE#{attendance.attendance_date}",
            },
            update_fields,
        )
