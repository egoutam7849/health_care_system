import os
import pandas as pd
from typing import Optional

class BaseStorageProvider:
    def save_parquet(self, df: pd.DataFrame, relative_path: str) -> str:
        raise NotImplementedError
    
    def read_parquet(self, relative_path: str) -> pd.DataFrame:
        raise NotImplementedError

class LocalStorageProvider(BaseStorageProvider):
    def __init__(self, base_dir: Optional[str] = None):
        if not base_dir:
            self.base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data"))
        else:
            self.base_dir = base_dir
        
        os.makedirs(os.path.join(self.base_dir, "bronze"), exist_ok=True)
        os.makedirs(os.path.join(self.base_dir, "silver"), exist_ok=True)
        os.makedirs(os.path.join(self.base_dir, "gold"), exist_ok=True)

    def save_parquet(self, df: pd.DataFrame, relative_path: str) -> str:
        full_path = os.path.join(self.base_dir, relative_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        df.to_parquet(full_path, index=False)
        return full_path

    def read_parquet(self, relative_path: str) -> pd.DataFrame:
        full_path = os.path.join(self.base_dir, relative_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Parquet file not found at: {full_path}")
        return pd.read_parquet(full_path)

class S3StorageProvider(BaseStorageProvider):
    def __init__(self, bucket_name: str, aws_access_key: str, aws_secret_key: str):
        self.bucket_name = bucket_name
        self.aws_access_key = aws_access_key
        self.aws_secret_key = aws_secret_key
        # Fallback to LocalStorageProvider if boto3 credentials unavailable
        self.local_fallback = LocalStorageProvider()

    def save_parquet(self, df: pd.DataFrame, relative_path: str) -> str:
        try:
            import boto3
            from io import BytesIO
            s3 = boto3.client(
                's3',
                aws_access_key_id=self.aws_access_key,
                aws_secret_access_key=self.aws_secret_key
            )
            out_buffer = BytesIO()
            df.to_parquet(out_buffer, index=False)
            s3.put_object(Bucket=self.bucket_name, Key=relative_path, Body=out_buffer.getvalue())
            return f"s3://{self.bucket_name}/{relative_path}"
        except Exception:
            # Fallback to local disk storage
            return self.local_fallback.save_parquet(df, relative_path)

    def read_parquet(self, relative_path: str) -> pd.DataFrame:
        try:
            import boto3
            from io import BytesIO
            s3 = boto3.client(
                's3',
                aws_access_key_id=self.aws_access_key,
                aws_secret_access_key=self.aws_secret_key
            )
            obj = s3.get_object(Bucket=self.bucket_name, Key=relative_path)
            return pd.read_parquet(BytesIO(obj['Body'].read()))
        except Exception:
            return self.local_fallback.read_parquet(relative_path)

def get_storage_provider() -> BaseStorageProvider:
    storage_type = os.getenv("STORAGE_TYPE", "local").lower()
    if storage_type == "s3":
        bucket = os.getenv("AWS_S3_BUCKET", "healthflow-data-lake")
        access_key = os.getenv("AWS_ACCESS_KEY_ID", "")
        secret_key = os.getenv("AWS_SECRET_ACCESS_KEY", "")
        return S3StorageProvider(bucket, access_key, secret_key)
    return LocalStorageProvider()
