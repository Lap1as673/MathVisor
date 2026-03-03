// Валидация на клиенте
const Validators = {
    // Проверка математического выражения
    validateFunction: (func) => {
        if (!func || func.trim() === '') {
            return { valid: false, error: 'Функция не может быть пустой' };
        }

        // Базовые проверки
        if (func.length > 200) {
            return { valid: false, error: 'Слишком длинное выражение' };
        }

        // Проверка на опасные символы
        const dangerousPatterns = [
            /[\[\]{};]/g,  // скобки и точки с запятой
            /(import|eval|exec|require)/gi,  // опасные ключевые слова
            /__\w+__/g,  // магические методы
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(func)) {
                return { valid: false, error: 'Обнаружены запрещенные символы' };
            }
        }

        // Проверка на допустимые символы
        const allowedPattern = /^[a-zA-Z0-9\s\+\-\*\/\^\(\)\.,\!\=\<\>\&\|]+$/;
        if (!allowedPattern.test(func)) {
            return { valid: false, error: 'Использованы недопустимые символы' };
        }

        return { valid: true, error: null };
    },

    // Проверка диапазона
    validateRange: (min, max) => {
        min = parseFloat(min);
        max = parseFloat(max);

        if (isNaN(min) || isNaN(max)) {
            return { valid: false, error: 'Некорректные значения диапазона' };
        }

        if (min >= max) {
            return { valid: false, error: 'Минимальное значение должно быть меньше максимального' };
        }

        if (Math.abs(min) > 1e6 || Math.abs(max) > 1e6) {
            return { valid: false, error: 'Слишком большой диапазон' };
        }

        return { valid: true, error: null };
    },

    // Проверка количества точек
    validatePoints: (points) => {
        points = parseInt(points);
        if (isNaN(points) || points < 10 || points > 2000) {
            return { valid: false, error: 'Количество точек должно быть от 10 до 2000' };
        }
        return { valid: true, error: null };
    }
};

window.Validators = Validators;