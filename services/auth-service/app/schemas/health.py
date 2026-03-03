from pydantic import BaseModel
from datetime import datetime

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "version": "0.1.0",
                "timestamp": "2024-01-20T10:30:00.123456"
            }
        }