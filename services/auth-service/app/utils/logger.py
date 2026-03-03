import logging
import sys
from app.core.config import settings

def setup_logging():
    
    log_format = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_format)
    
    root_logger = logging.getLogger()
    root_logger.addHandler(console_handler)
    
    if settings.DEBUG:
        root_logger.setLevel(logging.DEBUG)
    else:
        root_logger.setLevel(logging.INFO)
    
    logger = logging.getLogger("auth_service")
    return logger

logger = setup_logging()