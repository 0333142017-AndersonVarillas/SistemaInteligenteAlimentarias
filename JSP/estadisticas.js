// === estadisticas.js ===

const ctx = document.getElementById('barChart').getContext('2d');
let chart;

// --- Función para obtener los datos globales acumulados ---
function obtenerDatos() {
    let acumulado = { bajo: 0, medio: 0, alto: 0 };

    for (let enc = 1; enc <= 50; enc++) {
        for (let i = 1; i <= 4; i++) {
            const key = `resultadoBloque${i}_encuestador${enc}`;
            const bloque = JSON.parse(localStorage.getItem(key));

            if (bloque && bloque.nivel) {
                switch (bloque.nivel.toLowerCase()) {
                    case 'bajo': acumulado.bajo++; break;
                    case 'medio': acumulado.medio++; break;
                    case 'alto': acumulado.alto++; break;
                }
            }
        }
    }
    return acumulado;
}

// --- Función que renderiza o actualiza el gráfico ---
function renderChart() {
    const datos = obtenerDatos();
    const labels = ['Bajo', 'Medio', 'Alto'];
    const values = [datos.bajo, datos.medio, datos.alto];
    const total = values.reduce((a, b) => a + b, 0);

    document.getElementById('totalParticipantes').textContent =
        `Total de encuestados: ${total}`;

    if (chart) {
        chart.data.datasets[0].data = values;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad de encuestados',
                    data: values,
                    backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71']
                }]
            },
            options: {
                responsive: true,
                animation: true,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Número de personas' } },
                    x: { title: { display: true, text: 'Nivel de resultado' } }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Resultados acumulados en tiempo real' }
                }
            }
        });
    }
}

setInterval(renderChart, 5000);
renderChart();
