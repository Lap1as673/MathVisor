from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union
from datetime import datetime

class Plot2DRequest(BaseModel):
    """Запрос на построение 2D графика"""
    
    function: str = Field(
        ...,  # ... означает обязательное поле
        description="Математическая функция (например: sin(x), x**2 + 2*x + 1)",
        examples=["sin(x)", "cos(x) + sin(2*x)", "exp(-x) * sin(2*pi*x)"]
    )
    
    x_range: List[float] = Field(
        default=[-10, 10],
        description="Диапазон по оси X в формате [min, max]",
        examples=[[-5, 5], [0, 3.14]]
    )
    
    num_points: int = Field(
        default=200,
        ge=10,  # больше или равно 10
        le=1000,  # меньше или равно 1000
        description="Количество точек для построения (от 10 до 1000)"
    )
    
    @validator('x_range')
    def validate_x_range(cls, v):
        """Проверка корректности диапазона"""
        if len(v) != 2:
            raise ValueError('x_range должен содержать 2 значения: [min, max]')
        if v[0] >= v[1]:
            raise ValueError('min должен быть меньше max')
        return v
    
    @validator('function')
    def validate_function_not_empty(cls, v):
        """Проверка, что функция не пустая"""
        if not v or not v.strip():
            raise ValueError('Функция не может быть пустой')
        return v.strip()
    
    class Config:
        json_schema_extra = {
            "example": {
                "function": "sin(x)",
                "x_range": [-5, 5],
                "num_points": 300
            }
        }


class Plot2DResponse(BaseModel):
    """Ответ с данными для 2D графика"""
    
    x: List[float] = Field(..., description="Массив значений X")
    y: List[Optional[float]] = Field(..., description="Массив значений Y (None если точка не определена)")
    expression: str = Field(..., description="Исходное выражение")
    range: List[float] = Field(..., description="Использованный диапазон")
    points: int = Field(..., description="Количество точек")
    computed_at: datetime = Field(default_factory=datetime.now, description="Время вычисления")
    
    class Config:
        json_schema_extra = {
            "example": {
                "x": [-5.0, -4.9, -4.8],
                "y": [0.958, 0.982, 0.996],
                "expression": "sin(x)",
                "range": [-5, 5],
                "points": 200,
                "computed_at": "2024-01-20T12:00:00.123456"
            }
        }


class ErrorResponse(BaseModel):
    """Стандартный ответ с ошибкой"""
    
    detail: str = Field(..., description="Описание ошибки")
    status_code: int = Field(..., description="HTTP статус код")
    
    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Ошибка парсинга выражения: неподдерживаемая переменная 'z'",
                "status_code": 400
            }
        }