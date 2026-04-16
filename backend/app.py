from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from flask import Flask, jsonify, request
from flask_cors import CORS
from pypdf import PdfReader
from werkzeug.utils import secure_filename

from db import create_upload, get_demo_user, get_latest_upload, init_db

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
ALLOWED_EXTENSIONS = {"pdf"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_pdf_text(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    pages: list[str] = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        cleaned_text = page_text.strip()
        if cleaned_text:
            pages.append(cleaned_text)

    return "\n\n".join(pages).strip()


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    init_db()

    @app.get("/api/health")
    def health() -> tuple[dict[str, str], int]:
        return {"status": "ok", "phase": "phase-1", "message": "Khadamny core app ready"}, 200

    @app.get("/api/user")
    def user() -> tuple[dict[str, object], int]:
        return get_demo_user(), 200

    @app.get("/api/uploads/latest")
    def latest_upload() -> tuple[dict[str, object], int]:
        upload = get_latest_upload()
        if upload is None:
            return {"upload": None}, 404
        return {"upload": upload}, 200

    @app.post("/api/upload-cv")
    def upload_cv() -> tuple[dict[str, object], int]:
        if "cv" not in request.files:
            return {"error": "Missing CV file"}, 400

        file = request.files["cv"]
        if not file.filename:
            return {"error": "No file selected"}, 400
        if not allowed_file(file.filename):
            return {"error": "Only PDF files are supported"}, 400

        safe_name = secure_filename(file.filename)
        stored_name = f"{uuid4().hex}_{safe_name}"
        stored_path = UPLOAD_DIR / stored_name
        file.save(stored_path)

        try:
            extracted_text = extract_pdf_text(stored_path)
        except Exception as exc:  # pylint: disable=broad-except
            if stored_path.exists():
                stored_path.unlink()
            return {"error": "Unable to read the PDF", "details": str(exc)}, 400

        if not extracted_text:
            extracted_text = "Aucun texte extrait du PDF."

        demo_user = get_demo_user()
        upload_id = create_upload(
            user_id=int(demo_user["id"]),
            filename=safe_name,
            stored_path=str(stored_path),
            extracted_text=extracted_text,
        )

        return (
            {
                "message": "CV analysé avec succès",
                "upload_id": upload_id,
                "user": demo_user,
                "filename": safe_name,
                "extracted_text": extracted_text,
                "character_count": len(extracted_text),
            },
            200,
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
