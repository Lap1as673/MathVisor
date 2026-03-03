import sympy as sp
import numpy as np
from typing import List, Tuple, Dict, Any
import re
from app.utils.logger import logger

# Разрешенные математические функции и константы
ALLOWED_FUNCTIONS = {
    # Тригонометрия
    'sin': sp.sin,
    'cos': sp.cos,
    'tan': sp.tan,
    'asin': sp.asin,
    'acos': sp.acos,
    'atan': sp.atan,
    'sinh': sp.sinh,
    'cosh': sp.cosh,
    'tanh': sp.tanh,
    
    # Экспонента и логарифмы
    'exp': sp.exp,
    'log': sp.log,
    'ln': sp.log,
    'log10': sp.log,
    
    # Степени и корни
    'sqrt': sp.sqrt,
    'cbrt': lambda x: x**(1/3),
    
    # Другие полезные функции
    'abs': sp.Abs,
    'floor': sp.floor,
    'ceiling': sp.ceiling,
    'gamma': sp.gamma,  
    'erf': sp.erf,    
}

# Разрешенные константы
ALLOWED_CONSTANTS = {
    'pi': sp.pi,
    'e': sp.E,
    'E': sp.E,
    'oo': sp.oo,  # бесконечность
}

class MathSandbox:
    
    def __init__(self):
        self.x = sp.Symbol('x')  # Основная переменная
        self.y = sp.Symbol('y')  # Для 3D графиков
        self.t = sp.Symbol('t')  # Для параметрических/временных функций
        
    def validate_expression(self, expression: str) -> Tuple[bool, str]:
        # Запрещенные паттерны
        dangerous_patterns = [
            r'__[\w]+__',           # магические методы
            r'import\s+\w+',         # импорты
            r'exec\s*\(',            # exec
            r'eval\s*\(',             # eval
            r'open\s*\(',             # открытие файлов
            r'os\.',                  # доступ к ОС
            r'sys\.',                  # доступ к системе
            r'subprocess',             # запуск процессов
            r'globals\(\)',            # доступ к глобальным переменным
            r'locals\(\)',             # доступ к локальным переменным
            r'getattr',                 # рефлексия
            r'setattr',                 # рефлексия
            r'delattr',                  # рефлексия
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, expression):
                return False, f"Обнаружено опасное выражение: {pattern}"
        
        return True, "OK"
    
    def parse_expression(self, expression: str) -> Tuple[bool, Any, str]:
        try:
            # Проверка на опасные конструкции
            is_valid, msg = self.validate_expression(expression)
            if not is_valid:
                return False, None, msg
            
            # Парсим выражение с разрешенными функциями и константами
            parsed_expr = sp.sympify(
                expression,
                locals={**ALLOWED_FUNCTIONS, **ALLOWED_CONSTANTS}
            )
            
            # Проверяем, что выражение использует только разрешенные переменные
            free_symbols = parsed_expr.free_symbols
            allowed_symbols = {self.x, self.y, self.t}
            
            for symbol in free_symbols:
                if symbol not in allowed_symbols:
                    return False, None, f"Использована неподдерживаемая переменная: {symbol}"
            
            return True, parsed_expr, "OK"
            
        except sp.SympifyError as e:
            return False, None, f"Ошибка парсинга выражения: {str(e)}"
        except Exception as e:
            logger.error(f"Неожиданная ошибка при парсинге: {str(e)}")
            return False, None, f"Внутренняя ошибка: {str(e)}"
    
    def evaluate_2d_function(self, expression: str, x_range: List[float], num_points: int = 200) -> Tuple[bool, Dict, str]:
        try:
            # Парсим выражение
            success, expr, error_msg = self.parse_expression(expression)
            if not success:
                return False, {}, error_msg
            
            # Создаем лямбда-функцию для быстрых вычислений
            f = sp.lambdify(self.x, expr, modules=['numpy', 'sympy'])
            
            # Генерируем точки x
            x_min, x_max = x_range
            x_values = np.linspace(x_min, x_max, num_points)
            
            # Вычисляем y значения
            try:
                y_values = f(x_values)
                
                # Обработка специальных случаев (бесконечности, NaN)
                y_values = np.where(np.isinf(y_values) | np.isnan(y_values), None, y_values)
                
                # Преобразуем numpy массивы в обычные списки для JSON
                x_list = x_values.tolist()
                y_list = [float(y) if y is not None else None for y in y_values]
                
                result = {
                    "x": x_list,
                    "y": y_list,
                    "expression": expression,
                    "range": x_range,
                    "points": num_points
                }
                
                return True, result, "OK"
                
            except Exception as e:
                return False, {}, f"Ошибка при вычислении значений: {str(e)}"
                
        except Exception as e:
            logger.error(f"Ошибка в evaluate_2d_function: {str(e)}")
            return False, {}, f"Внутренняя ошибка: {str(e)}"

math_sandbox = MathSandbox()