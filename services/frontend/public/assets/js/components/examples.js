// Компонент с примерами функций
class ExamplesComponent {
    constructor(containerId, onSelectCallback) {
        this.container = document.getElementById(containerId);
        this.onSelect = onSelectCallback;
        this.examples = [];
    }

    async loadExamples() {
        try {
            const response = await window.graphApi.getExamples();
            this.examples = response.examples;
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки примеров:', error);
            this.renderError();
        }
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = this.examples.map(example => `
            <div class="example-item" data-function="${example.function}" data-xmin="${example.x_range[0]}" data-xmax="${example.x_range[1]}">
                <div class="example-preview" style="border-left-color: ${example.color}">
                    <div class="example-name">${example.name}</div>
                    <div class="example-function">f(x) = ${example.function}</div>
                    <div class="example-description">${example.description}</div>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики
        this.container.querySelectorAll('.example-item').forEach(item => {
            item.addEventListener('click', () => {
                const func = item.dataset.function;
                const xMin = item.dataset.xmin;
                const xMax = item.dataset.xmax;
                
                // Убираем выделение у всех
                this.container.querySelectorAll('.example-item').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Выделяем выбранный
                item.classList.add('selected');
                
                // Вызываем колбэк
                if (this.onSelect) {
                    this.onSelect(func, xMin, xMax);
                }
            });
        });
    }

    renderError() {
        this.container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Не удалось загрузить примеры</p>
                <button class="btn btn-secondary" onclick="window.location.reload()">
                    Повторить
                </button>
            </div>
        `;
    }
}

// Делаем класс глобальным
window.ExamplesComponent = ExamplesComponent;