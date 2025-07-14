from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = "marketplace-uploads"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_file_to_supabase(file_bytes, filename, content_type):
    path_in_bucket = f"uploads/{filename}"

    res = supabase.storage.from_(BUCKET_NAME).upload(
        path_in_bucket,
        file_bytes,
        {"content-type": content_type,
        "upsert": "true" }
    )

    if hasattr(res, "status_code") and res.status_code != 200:
        error_message = res.json().get("error", "Unknown error")
        raise Exception(f"Supabase upload failed: {error_message}")

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(path_in_bucket)
    return public_url
