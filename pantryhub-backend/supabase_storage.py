from supabase import create_client
import os
import uuid

SUPABASE_URL = os.environ.get("DATABASE_URL")
SUPABASE_PUBLIC_KEY = os.environ.get("SUPABASE_PUBLIC_KEY")
BUCKET_NAME = "marketplace-images"

supabase = create_client(SUPABASE_URL, SUPABASE_PUBLIC_KEY)

def upload_file_to_supabase(file_bytes, filename, content_type):
    unique_filename = f"{uuid.uuid4()}_{filename}"

    # Upload file
    res = supabase.storage.from_(BUCKET_NAME).upload(
        unique_filename,
        file_bytes,
        {"content-type": content_type}
    )

    if res.get("error"):
        raise Exception(f"Supabase upload failed: {res['error']['message']}")

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{unique_filename}"

    return public_url
