// HTTP клиент для работы с API
class ApiClient {
    constructor(baseURL = 'http://localhost:8000/api/v1') {
        this.baseURL = baseURL;
        this.timeout = 30000; // 30 секунд
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            mode: 'cors',
        };

        const fetchOptions = { ...defaultOptions, ...options };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(url, { 
                ...fetchOptions, 
                signal: controller.signal 
            });
            
            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.detail || 'Произошла ошибка',
                    data: data
                };
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw { status: 408, message: 'Таймаут запроса' };
            }
            throw error;
        }
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET',
        });
    }
}

// Создаем экземпляр клиента
window.apiClient = new ApiClient();