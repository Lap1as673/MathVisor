class App {
    constructor() {
        this.chart = null;
        this.form = null;
        this.examples = null;
        this.init();
    }

    async init() {
        this.chart = new ChartComponent('functionChart');
        this.form = new PlotFormComponent('plotForm', this.handlePlotSubmit.bind(this));
        this.examples = new ExamplesComponent('examplesContainer', this.handleExampleSelect.bind(this));

        await this.examples.loadExamples();

        this.initTheme();

        this.loadLastPlot();

        this.initEventListeners();
    }

    async handlePlotSubmit(func, xMin, xMax, points) {
        try {
            const data = await window.graphApi.plot2D(func, xMin, xMax, points);
            this.chart.plot(data);
            
            this.saveToHistory(func, xMin, xMax, points);
            
            return data;
        } catch (error) {
            console.error('Ошибка:', error);
            throw new Error(error.message || 'Ошибка соединения с сервером');
        }
    }

    handleExampleSelect(func, xMin, xMax) {
        this.form.setValues(func, xMin, xMax);
        this.form.submit();
    }

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

    saveToHistory(func, xMin, xMax, points) {
        const history = Helpers.loadFromStorage('plotHistory', []);
        
        history.unshift({
            func,
            xMin,
            xMax,
            points,
            timestamp: Date.now()
        });

        if (history.length > 10) {
            history.pop();
        }

        Helpers.saveToStorage('plotHistory', history);
    }

    loadLastPlot() {
        const history = Helpers.loadFromStorage('plotHistory', []);
        if (history.length > 0) {
            const last = history[0];
            this.form.setValues(last.func, last.xMin, last.xMax);
        }
    }

    initEventListeners() {
        document.getElementById('downloadPNG')?.addEventListener('click', () => {
            this.chart?.downloadPNG();
        });

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

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.form?.submit();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});