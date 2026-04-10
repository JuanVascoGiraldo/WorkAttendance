from datetime import datetime, timezone
from fastapi import Header, HTTPException


def get_utc_timestamp(timestamp: str | None = Header(default=None, alias="TIMESTAMP")) -> datetime:
	if not timestamp:
		return datetime.now(timezone.utc)

	try:
		parsed = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
	except ValueError as exc:
		raise HTTPException(status_code=400, detail="Invalid TIMESTAMP header format") from exc

	if parsed.tzinfo is None:
		parsed = parsed.replace(tzinfo=timezone.utc)

	return parsed.astimezone(timezone.utc)