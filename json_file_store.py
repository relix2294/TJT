"""
Cross-process safe JSON read/write for config.json and sys_registry.json.

Uses filelock (advisory flock on ``{path}.lock``) plus atomic replace via a
temporary sibling file so concurrent Next.js and Python writers cannot corrupt
payloads mid-write.
"""

from __future__ import annotations

import json
import logging
import os
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator, TypeVar

from filelock import FileLock, Timeout

logger = logging.getLogger(__name__)

LOCK_TIMEOUT_SECONDS = 5.0
LOCK_STALE_SECONDS = 30.0

T = TypeVar("T")


def _lock_path(target: Path) -> Path:
    return Path(f"{target}.lock")


def _break_stale_lock(lock_path: Path) -> None:
    """Remove a lock file left behind by a crashed process."""
    try:
        stat = lock_path.stat()
    except OSError:
        return
    if time.time() - stat.st_mtime > LOCK_STALE_SECONDS:
        try:
            lock_path.unlink()
            logger.warning("[json_file_store] Removed stale lock: %s", lock_path)
        except OSError as exc:
            logger.error(
                "[json_file_store] Failed to remove stale lock %s: %s",
                lock_path,
                exc,
            )


def _read_json_unlocked(target: Path, default: T) -> T:
    if not target.exists():
        return default
    try:
        with target.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except json.JSONDecodeError as exc:
        logger.error(
            "[json_file_store] Invalid JSON in %s (possibly mid-write): %s",
            target,
            exc,
        )
        raise ValueError(
            f"{target.name} is not valid JSON (possibly mid-write)."
        ) from exc


def _write_json_atomic_unlocked(target: Path, data: Any) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = target.with_name(f"{target.name}.tmp.{os.getpid()}")
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    try:
        tmp_path.write_text(payload, encoding="utf-8")
        tmp_path.replace(target)
    finally:
        try:
            tmp_path.unlink(missing_ok=True)
        except OSError:
            pass


@contextmanager
def locked_json_transaction(
    target: Path,
    default: T,
) -> Iterator[T]:
    """
    Acquire an exclusive cross-process lock, yield the parsed JSON document,
    and atomically persist any in-place mutations when the context exits.
    """
    lock = FileLock(_lock_path(target), timeout=LOCK_TIMEOUT_SECONDS)
    try:
        _break_stale_lock(_lock_path(target))
        with lock:
            data: T = _read_json_unlocked(target, default)
            yield data
            _write_json_atomic_unlocked(target, data)
    except Timeout as exc:
        logger.error(
            "[json_file_store] Timed out acquiring lock for %s after %.1fs",
            target,
            LOCK_TIMEOUT_SECONDS,
        )
        raise TimeoutError(
            f"Timed out acquiring lock for {target} after {LOCK_TIMEOUT_SECONDS}s"
        ) from exc


def write_json_file(target: Path, data: Any) -> None:
    """Replace a JSON file atomically under an exclusive lock."""
    lock = FileLock(_lock_path(target), timeout=LOCK_TIMEOUT_SECONDS)
    try:
        _break_stale_lock(_lock_path(target))
        with lock:
            _write_json_atomic_unlocked(target, data)
    except Timeout as exc:
        logger.error(
            "[json_file_store] Timed out acquiring lock for %s after %.1fs",
            target,
            LOCK_TIMEOUT_SECONDS,
        )
        raise TimeoutError(
            f"Timed out acquiring lock for {target} after {LOCK_TIMEOUT_SECONDS}s"
        ) from exc
