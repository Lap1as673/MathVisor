// Главный файл приложения
class App {
    constructor() {
        this.chart = null;
        this.form = null;
        this.examples = null;
        this.init();
    }

    async init() {
        // Инициализация компонентов
        this.chart = new ChartComponent('functionChart');
        this.form = new PlotFormComponent('plotForm', this.handlePlotSubmit.bind(this));
        this.examples = new ExamplesComponent('examplesContainer', this.handleExampleSelect.bind(this));

        // Загрузка примеров
        await this.examples.loadExamples();

        // Инициализация темы
        this.initTheme();

        // Загрузка последнего графика из истории
        this.loadLastPlot();

        // Добавление обработчиков событий
        this.initEventListeners();
    }

    // Обработка отправки формы
    async handlePlotSubmit(func, xMin, xMax, points) {
        try {
            const data = await window.graphApi.plot2D(func, xMin, xMax, points);
            this.chart.plot(data);
            
            // Сохраняем в историю
            this.saveToHistory(func, xMin, xMax, points);
            
            return data;
        } catch (error) {
            console.error('Ошибка:', error);
            throw new Error(error.message || 'Ошибка соединения с сервером');
        }
    }

    // Обработка выбора примера
    handleExampleSelect(func, xMin, xMax) {
        this.form.setValues(func, xMin, xMax);
        // Автоматически строим график
        this.form.submit();
    }

    // Инициализация темы
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = Helpers.loadFromStorage('theme', 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            Helpers.saveToStorage('theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            // Обновляем тему графика
            if (this.chart) {
                this.chart.updateTheme();
            }
        });
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Сохранение в историю
    saveToHistory(func, xMin, xMax, points) {
        const history = Helpers.loadFromStorage('plotHistory', []);
        
        history.unshift({
            func,
            xMin,
            xMax,
            points,
            timestamp: Date.now()
        });

        // Ограничиваем историю 10 элементами
        if (history.length > 10) {
            history.pop();
        }

        Helpers.saveToStorage('plotHistory', history);
    }

    // Загрузка последнего графика
    loadLastPlot() {
        const history = Helpers.loadFromStorage('plotHistory', []);
        if (history.length > 0) {
            const last = history[0];
            this.form.setValues(last.func, last.xMin, last.xMax);
            // Не строим автоматически, только показываем в форме
        }
    }

    // Инициализация обработчиков событий
    initEventListeners() {
        // Кнопка сохранения PNG
        document.getElementById('downloadPNG')?.addEventListener('click', () => {
            this.chart?.downloadPNG();
        });

        // Кнопка полноэкранного режима
        document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
            const plotCard = document.querySelector('.plot-card');
            if (plotCard) {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    plotCard.requestFullscreen();
                }
            }
        });

        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter для отправки формы
            if (e.ctrlKey && e.key === 'Enter') {
                this.form?.submit();
            }
        });
    }
}

// Запуск приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});