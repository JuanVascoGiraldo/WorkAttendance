from app.domain.aggregate.users import Area, Role, User
from app.infrastructure.persistance.mongodb.dao import UserDao
from app.domain.aggregate.users import WorkAttendance
from app.infrastructure.persistance.mongodb.dao import WorkAttendanceDao
from uuid import UUID

def from_work_attendance_to_work_attendance_dao(attendance: WorkAttendance, user_id: UUID) -> WorkAttendanceDao:
    return WorkAttendanceDao(
        id=attendance.id,
        user_id=user_id,
        attendance_date=attendance.attendance_date,
        check_in_time=attendance.check_in_time,
        check_out_time=attendance.check_out_time,
        status=attendance.status,
        created_at=attendance.created_at,
        updated_at=attendance.updated_at,
    )


def from_user_to_user_dao(user: User) -> UserDao:
    attendances = [
        from_work_attendance_to_work_attendance_dao(item, user.id)
        for item in user.work_attendances
    ]
    return UserDao(
        id=user.id,
        employee_number=user.employee_number,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_active=user.is_active,
        role=int(user.role),
        areas=[int(area) for area in user.areas],
        supervisor_id=user.supervisor_id,
        work_attendances=attendances,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )

def from_work_attendance_dao_to_work_attendance(attendance_dao: WorkAttendanceDao) -> WorkAttendance:
    return WorkAttendance(
        id=attendance_dao.id,
        attendance_date=attendance_dao.attendance_date,
        check_in_time=attendance_dao.check_in_time,
        check_out_time=attendance_dao.check_out_time,
        status=attendance_dao.status,
        created_at=attendance_dao.created_at,
        updated_at=attendance_dao.updated_at,
    )


def from_user_dao_to_user(user_dao: UserDao) -> User:
    areas = []
    for item in user_dao.areas:
        try:
            areas.append(Area(item))
        except ValueError:
            continue

    return User(
        id=user_dao.id,
        employee_number=user_dao.employee_number,
        first_name=user_dao.first_name,
        last_name=user_dao.last_name,
        email=user_dao.email,
        is_active=user_dao.is_active,
        role=Role(user_dao.role),
        areas=areas,
        supervisor_id=user_dao.supervisor_id,
        work_attendances=[
            from_work_attendance_dao_to_work_attendance(item)
            for item in user_dao.work_attendances
        ],
        created_at=user_dao.created_at,
        updated_at=user_dao.updated_at,
    )
    