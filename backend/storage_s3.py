import os
import uuid
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "landvest-minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "landvestadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "landvestpassword123")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "landvest-documents")
PUBLIC_MINIO_URL = os.getenv("PUBLIC_MINIO_URL", "http://localhost:9080")

s3_client = boto3.client(
    "s3",
    endpoint_url=f"http://{MINIO_ENDPOINT}",
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    config=Config(signature_version="s3v4"),
    region_name="us-east-1"
)

def init_s3_bucket():
    try:
        s3_client.head_bucket(Bucket=MINIO_BUCKET)
    except ClientError:
        try:
            s3_client.create_bucket(Bucket=MINIO_BUCKET)
            # Set public read policy for images and documents
            import json
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicRead",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{MINIO_BUCKET}/*"]
                    }
                ]
            }
            s3_client.put_bucket_policy(Bucket=MINIO_BUCKET, Policy=json.dumps(policy))
        except Exception as e:
            print(f"Warning: MinIO bucket setup warning: {e}")

def upload_file_bytes(file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
    ext = os.path.splitext(filename)[1]
    unique_key = f"uploads/{uuid.uuid4().hex[:12]}_{filename.replace(' ', '_')}"
    
    s3_client.put_object(
        Bucket=MINIO_BUCKET,
        Key=unique_key,
        Body=file_bytes,
        ContentType=content_type
    )
    return f"{PUBLIC_MINIO_URL}/{MINIO_BUCKET}/{unique_key}"
