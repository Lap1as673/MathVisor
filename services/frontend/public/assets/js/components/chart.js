class ChartComponent {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.chart = null;
        this.ctx = this.canvas?.getContext('2d');
    }

    plot(data) {
        if (!this.ctx || !data) return;

        if (this.chart) {
            this.chart.destroy();
        }

        const datasets = [{
            label: `f(x) = ${data.expression}`,
            data: data.x.map((x, i) => ({ x: x, y: data.y[i] })),
            borderColor: 'rgb(67, 97, 238)',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.1,
            fill: false,
        }];

        const config = {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 750,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary'),
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `f(x) = ${context.parsed.y.toFixed(4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'x',
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary'),
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color'),
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary'),
                        }
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'f(x)',
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary'),
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--border-color'),
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-secondary'),
                        }
                    }
                }
            }
        };

        this.chart = new Chart(this.ctx, config);
        
        this.updateInfo(data);
    }

    updateInfo(data) {
        const functionSpan = document.getElementById('currentFunction');
        const statsSpan = document.getElementById('plotStats');
        
        if (functionSpan) {
            functionSpan.textContent = `f(x) = ${data.expression}`;
        }
        
        if (statsSpan) {
            const nonNull = data.y.filter(y => y !== null).length;
            statsSpan.textContent = `Точек: ${data.x.length} (${nonNull} отображено) • [${data.range[0]}, ${data.range[1]}]`;
        }
    }

    clear() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        const ctx = this.canvas?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    downloadPNG() {
        if (!this.canvas) return;
        
        const link = document.createElement('a');
        link.download = `graph-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    updateTheme() {
        if (this.chart) {
            const textColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-secondary').trim();
            const gridColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--border-color').trim();
            
            this.chart.options.scales.x.ticks.color = textColor;
            this.chart.options.scales.y.ticks.color = textColor;
            this.chart.options.scales.x.grid.color = gridColor;
            this.chart.options.scales.y.grid.color = gridColor;
            this.chart.options.plugins.legend.labels.color = textColor;
            
            this.chart.update();
        }
    }
}

window.ChartComponent = ChartComponent;