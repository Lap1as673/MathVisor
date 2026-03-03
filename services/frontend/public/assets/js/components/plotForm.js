class PlotFormComponent {
    constructor(formId, onSubmitCallback) {
        this.form = document.getElementById(formId);
        this.onSubmit = onSubmitCallback;
        
        this.funcInput = document.getElementById('function');
        this.xMinInput = document.getElementById('xMin');
        this.xMaxInput = document.getElementById('xMax');
        this.pointsInput = document.getElementById('points');
        this.pointCountDisplay = document.getElementById('pointCountDisplay');
        this.errorMessage = document.getElementById('errorMessage');
        this.plotBtn = document.getElementById('plotBtn');
        
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submit();
        });

        if (this.pointsInput && this.pointCountDisplay) {
            this.pointsInput.addEventListener('input', () => {
                this.pointCountDisplay.textContent = this.pointsInput.value;
            });
        }

        if (this.funcInput) {
            this.funcInput.addEventListener('input', 
                Helpers.debounce(() => this.validate(), 500)
            );
        }
    }

    validate() {
        const func = this.funcInput?.value || '';
        const xMin = this.xMinInput?.value || '-10';
        const xMax = this.xMaxInput?.value || '10';
        const points = this.pointsInput?.value || '200';

        const funcValidation = Validators.validateFunction(func);
        if (!funcValidation.valid) {
            this.showError(funcValidation.error);
            return false;
        }

        const rangeValidation = Validators.validateRange(xMin, xMax);
        if (!rangeValidation.valid) {
            this.showError(rangeValidation.error);
            return false;
        }

        const pointsValidation = Validators.validatePoints(points);
        if (!pointsValidation.valid) {
            this.showError(pointsValidation.error);
            return false;
        }

        this.clearError();
        return true;
    }

    async submit() {
        if (!this.validate()) return;

        const func = this.funcInput.value;
        const xMin = this.xMinInput.value;
        const xMax = this.xMaxInput.value;
        const points = this.pointsInput.value;

        this.setLoading(true);

        try {
            await this.onSubmit(func, xMin, xMax, points);
            this.clearError();
        } catch (error) {
            this.showError(error.message || 'Ошибка при построении графика');
        } finally {
            this.setLoading(false);
        }
    }

    setValues(func, xMin, xMax) {
        if (this.funcInput) this.funcInput.value = func;
        if (this.xMinInput) this.xMinInput.value = xMin;
        if (this.xMaxInput) this.xMaxInput.value = xMax;
        
        this.validate();
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }
    }

    clearError() {
        if (this.errorMessage) {
            this.errorMessage.textContent = '';
            this.errorMessage.style.display = 'none';
        }
    }

    setLoading(loading) {
        if (this.plotBtn) {
            this.plotBtn.disabled = loading;
            this.plotBtn.innerHTML = loading 
                ? '<i class="fas fa-spinner fa-spin"></i> Построение...'
                : '<i class="fas fa-plot"></i> Построить';
        }
    }
}

window.PlotFormComponent = PlotFormComponent;