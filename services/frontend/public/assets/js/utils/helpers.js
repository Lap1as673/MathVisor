// Вспомогательные функции
const Helpers = {
    // Форматирование числа
    formatNumber: (num, digits = 2) => {
        if (num === null || num === undefined) return 'NaN';
        return Number(num).toFixed(digits);
    },

    // Задержка (debounce)
    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },

    // Генерация ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Сохранение в localStorage
    saveToStorage: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    },

    // Загрузка из localStorage
    loadFromStorage: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Ошибка загрузки из localStorage:', e);
            return defaultValue;
        }
    },

    // Показ уведомления
    showNotification: (message, type = 'info') => {
        // Можно реализовать красивые уведомления
        console.log(`[${type}] ${message}`);
    }
};

// Делаем глобальным
window.Helpers = Helpers;