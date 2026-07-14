"""Tests for the cross-process-safe JSON store."""

from __future__ import annotations

import time
from pathlib import Path

import pytest

from json_file_store import (
    _break_stale_lock,
    _lock_path,
    locked_json_transaction,
    write_json_file,
)


def test_transaction_reads_default_when_missing(tmp_path: Path) -> None:
    target = tmp_path / "data.json"
    with locked_json_transaction(target, {"n": 0}) as data:
        assert data == {"n": 0}
    # Default document is persisted on exit.
    assert target.exists()


def test_transaction_persists_mutation_atomically(tmp_path: Path) -> None:
    target = tmp_path / "data.json"
    with locked_json_transaction(target, {"n": 0}) as data:
        data["n"] = 5
    with locked_json_transaction(target, {"n": 0}) as data:
        assert data["n"] == 5
    # No stray temp files left behind by the atomic replace.
    assert not list(tmp_path.glob("data.json.tmp.*"))


def test_write_json_file_roundtrip(tmp_path: Path) -> None:
    target = tmp_path / "reg.json"
    write_json_file(target, {"a": [1, 2, 3]})
    with locked_json_transaction(target, {}) as data:
        assert data["a"] == [1, 2, 3]


def test_invalid_json_raises_value_error(tmp_path: Path) -> None:
    target = tmp_path / "broken.json"
    target.write_text("{not valid json", encoding="utf-8")
    with pytest.raises(ValueError):
        with locked_json_transaction(target, {}):
            pass


def test_unicode_is_preserved(tmp_path: Path) -> None:
    target = tmp_path / "u.json"
    write_json_file(target, {"msg": "Ниже риск"})
    assert "Ниже риск" in target.read_text(encoding="utf-8")


def test_break_stale_lock_removes_old_lock(tmp_path: Path) -> None:
    target = tmp_path / "data.json"
    lock = _lock_path(target)
    lock.write_text("", encoding="utf-8")
    # Backdate the lock well beyond the stale threshold.
    old = time.time() - 120
    import os

    os.utime(lock, (old, old))
    _break_stale_lock(lock)
    assert not lock.exists()


def test_break_stale_lock_keeps_fresh_lock(tmp_path: Path) -> None:
    target = tmp_path / "data.json"
    lock = _lock_path(target)
    lock.write_text("", encoding="utf-8")
    _break_stale_lock(lock)
    assert lock.exists()
