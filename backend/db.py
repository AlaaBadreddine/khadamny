from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "khadamny.db"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS cv_uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                filename TEXT NOT NULL,
                stored_path TEXT NOT NULL,
                extracted_text TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            """
        )
        connection.execute(
            """
            INSERT OR IGNORE INTO users (id, name, email, created_at)
            VALUES (1, 'Demo User', 'demo@khadamny.tn', ?)
            """,
            (utc_now(),),
        )


def get_demo_user() -> dict[str, Any]:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT id, name, email, created_at FROM users WHERE id = 1"
        ).fetchone()
        return dict(row) if row else {"id": 1, "name": "Demo User", "email": "demo@khadamny.tn"}


def create_upload(user_id: int, filename: str, stored_path: str, extracted_text: str) -> int:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO cv_uploads (user_id, filename, stored_path, extracted_text, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, filename, stored_path, extracted_text, utc_now()),
        )
        return int(cursor.lastrowid)


def get_latest_upload() -> dict[str, Any] | None:
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                cv_uploads.id,
                cv_uploads.filename,
                cv_uploads.stored_path,
                cv_uploads.extracted_text,
                cv_uploads.created_at,
                users.id AS user_id,
                users.name AS user_name,
                users.email AS user_email
            FROM cv_uploads
            JOIN users ON users.id = cv_uploads.user_id
            ORDER BY cv_uploads.id DESC
            LIMIT 1
            """
        ).fetchone()
        return dict(row) if row else None
