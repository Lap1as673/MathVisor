from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import health, plot  # Добавляем plot
from app.utils.logger import logger

# Создаем FastAPI приложение
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    description="""
    API для математических вычислений и отрисовки графиков.
    
    ## Возможности
    * ✅ Проверка работоспособности сервиса
    * ✅ Построение 2D графиков функций (НОВОЕ!)
    * 🔄 (Скоро) Построение 3D графиков
    * 🔄 (Скоро) Решение систем линейных уравнений
    * 🔄 (Скоро) Дифференциальные уравнения
    
    ## Как использовать
    1. Отправьте POST запрос на `/api/v1/plot/2d` с функцией
    2. Получите массивы точек для построения
    3. Используйте любой JavaScript графический движок для отрисовки
    
    ## Пример функции
    ```json
    {
        "function": "sin(x) + cos(2*x)",
        "x_range": [-5, 5],
        "num_points": 300
    }
    ```
    """
)

# Настройка CORS (оставляем как есть)
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Подключаем роутеры
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(plot.router, prefix=settings.API_V1_STR, tags=["plots"]) 


@app.on_event("startup")
async def startup_event():
    logger.info("="*50)
    logger.info(f"🚀 Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"📝 Documentation available at /docs")
    logger.info(f"🔧 Debug mode: {settings.DEBUG}")
    logger.info("="*50)

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Shutting down application...")

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }