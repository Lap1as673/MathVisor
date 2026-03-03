// API для работы с графиками
class GraphApi {
    constructor(client) {
        this.client = client;
    }

    // Построение 2D графика
    async plot2D(func, xMin, xMax, points = 200) {
        const data = {
            function: func,
            x_range: [parseFloat(xMin), parseFloat(xMax)],
            num_points: parseInt(points)
        };

        return this.client.post('/plot/2d', data);
    }

    // Получение примеров функций
    async getExamples() {
        return this.client.get('/plot/examples');
    }

    // Валидация функции через API (опционально)
    async validateFunction(func) {
        try {
            await this.plot2D(func, -1, 1, 10);
            return { valid: true, error: null };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

// Создаем экземпляр API
window.graphApi = new GraphApi(window.apiClient);