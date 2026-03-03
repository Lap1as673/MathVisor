from fastapi import APIRouter, HTTPException, status
from app.schemas.plot import Plot2DRequest, Plot2DResponse, ErrorResponse
from app.services.plot_calculator import plot_calculator
from app.utils.logger import logger
import traceback

router = APIRouter()

@router.post(
    "/plot/2d",
    response_model=Plot2DResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Ошибка в запросе"},
        422: {"model": ErrorResponse, "description": "Ошибка валидации"},
        500: {"model": ErrorResponse, "description": "Внутренняя ошибка сервера"}
    },
    summary="Построение 2D графика функции",
    description="""
    Построение графика математической функции одной переменной.
    
    ## Поддерживаемые функции:
    * Тригонометрические: sin(x), cos(x), tan(x), asin(x), acos(x), atan(x)
    * Гиперболические: sinh(x), cosh(x), tanh(x)
    * Экспонента и логарифмы: exp(x), log(x), ln(x), log10(x)
    * Степени и корни: x**2, sqrt(x), cbrt(x)
    * Константы: pi, e
    
    ## Примеры:
    * sin(x) + cos(x)
    * exp(-x) * sin(2*pi*x)
    * x**3 - 2*x**2 + x - 1
    * sqrt(16 - x**2)  # Полуокружность
    * gamma(x)  # Гамма-функция
    
    ## Ограничения:
    * Используйте только переменную 'x'
    * Не используйте опасные конструкции (import, eval, и т.д.)
    * Количество точек от 10 до 1000
    """
)
async def plot_2d(request: Plot2DRequest):
    """
    Построение 2D графика функции.
    """
    try:
        # Вычисляем график
        result = await plot_calculator.calculate_2d_plot(request)
        return result
        
    except ValueError as e:
        # Ошибки валидации или вычисления
        logger.warning(f"Ошибка в запросе: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
        
    except Exception as e:
        # Неожиданные ошибки
        logger.error(f"Внутренняя ошибка: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера. Попробуйте позже."
        )

@router.get(
    "/plot/examples",
    summary="Получить примеры функций",
    description="Возвращает список примеров функций для тестирования"
)
async def get_examples():
    """
    Возвращает список примеров функций для быстрого тестирования.
    """
    examples = [
        {
            "name": "Синусоида",
            "function": "sin(x)",
            "description": "Простая синусоида",
            "x_range": [-6.28, 6.28],
            "color": "blue"
        },
        {
            "name": "Затухающие колебания",
            "function": "exp(-0.2*x) * sin(2*x)",
            "description": "Затухающая синусоида",
            "x_range": [0, 10],
            "color": "red"
        },
        {
            "name": "Кубическая парабола",
            "function": "x**3 - 3*x",
            "description": "Кубическая функция с экстремумами",
            "x_range": [-3, 3],
            "color": "green"
        },
        {
            "name": "Полуокружность",
            "function": "sqrt(9 - x**2)",
            "description": "Верхняя половина окружности радиуса 3",
            "x_range": [-2.9, 2.9],
            "color": "purple"
        },
        {
            "name": "Гауссиана",
            "function": "exp(-x**2)",
            "description": "Колоколообразная кривая",
            "x_range": [-3, 3],
            "color": "orange"
        },
        {
            "name": "Дробная функция",
            "function": "1/(1 + x**2)",
            "description": "Функция с максимумом в нуле",
            "x_range": [-5, 5],
            "color": "brown"
        }
    ]
    return {"examples": examples}