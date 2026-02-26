from app.core.math_sandbox import math_sandbox
from app.schemas.plot import Plot2DRequest, Plot2DResponse
from app.utils.logger import logger
from typing import Dict, Any
from datetime import datetime

class PlotCalculator:
    """Сервис для вычисления графиков"""
    
    @staticmethod
    async def calculate_2d_plot(request: Plot2DRequest) -> Dict[str, Any]:
        """
        Вычисление 2D графика на основе запроса.
        """
        logger.info(f"Вычисление графика: {request.function} на {request.x_range}")
        
        # Вызываем песочницу
        success, result, error = math_sandbox.evaluate_2d_function(
            expression=request.function,
            x_range=request.x_range,
            num_points=request.num_points
        )
        
        if not success:
            logger.warning(f"Ошибка вычисления: {error}")
            raise ValueError(error)
        
        # Формируем ответ
        response = {
            "x": result["x"],
            "y": result["y"],
            "expression": result["expression"],
            "range": result["range"],
            "points": result["points"],
            "computed_at": datetime.now().isoformat()
        }
        
        logger.info(f"График успешно вычислен, точек: {len(result['x'])}")
        return response

# Создаем экземпляр сервиса
plot_calculator = PlotCalculator()