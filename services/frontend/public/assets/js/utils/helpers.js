const Helpers = {
    formatNumber: (num, digits = 2) => {
        if (num === null || num === undefined) return 'NaN';
        return Number(num).toFixed(digits);
    },

    debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },

    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    saveToStorage: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    },

    loadFromStorage: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Ошибка загрузки из localStorage:', e);
            return defaultValue;
        }
    },

    showNotification: (message, type = 'info') => {
        console.log(`[${type}] ${message}`);
    }
};

window.Helpers = Helpers;