import requests
import os

SUPABASE_URL = os.environ["DATABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SERVICE_KEY"]
BUCKET_NAME = "marketplace-uploads"

def upload_file_to_supabase(file_stream, filename, content_type):
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"
    headers = {
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": content_type
    }
    resp = requests.post(url, headers=headers, data=file_stream)
    if resp.status_code not in [200, 201]:
        raise Exception(f"Upload failed: {resp.status_code} {resp.text}")
    # Public URL:
    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{filename}"
