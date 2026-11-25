import boto3
from botocore.config import Config
from app.core.config import settings

s3= boto3.client(
    "s3",
    endpoint_url=settings.s3_endpoint,
    aws_access_key_id=settings.s3_access_key,
    aws_secret_access_key=settings.s3_secret_key,
    region_name="us-east-1",
    config=Config(s3={"addressing_style":"path"}),
)

def upload_file(data:bytes,key:str,content_type:str)->str:
    s3.put_object(
        Bucket=settings.s3_bucket,
        Key=key,
        Body=data,
        ContentType=content_type,
    )
    return f"{settings.s3_public_url}/{key}"