const Validators = {
    validateFunction: (func) => {
        if (!func || func.trim() === '') {
            return { valid: false, error: 'Функция не может быть пустой' };
        }

        if (func.length > 200) {
            return { valid: false, error: 'Слишком длинное выражение' };
        }

        const dangerousPatterns = [
            /[\[\]{};]/g,  
            /(import|eval|exec|require)/gi,  
            /__\w+__/g,  
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(func)) {
                return { valid: false, error: 'Обнаружены запрещенные символы' };
            }
        }

        const allowedPattern = /^[a-zA-Z0-9\s\+\-\*\/\^\(\)\.,\!\=\<\>\&\|]+$/;
        if (!allowedPattern.test(func)) {
            return { valid: false, error: 'Использованы недопустимые символы' };
        }

        return { valid: true, error: null };
    },

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

    validatePoints: (points) => {
        points = parseInt(points);
        if (isNaN(points) || points < 10 || points > 2000) {
            return { valid: false, error: 'Количество точек должно быть от 10 до 2000' };
        }
        return { valid: true, error: null };
    }
};

window.Validators = Validators;