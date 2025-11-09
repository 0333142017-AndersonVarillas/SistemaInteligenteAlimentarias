// === resultados.js ===
// Muestra resultados de todos los bloques y acciones del panel

document.addEventListener('DOMContentLoaded', function () {
    renderResults();

    const btnTTS = document.getElementById('btn-tts');
    const btnCopy = document.getElementById('btn-copy');
    const btnReset = document.getElementById('btn-reset');
    const btnStats = document.getElementById('btn-stats');

    // === Lectura automática de resultados ===
    btnTTS.addEventListener('click', leerResultados);

    // === Copiar resumen ===
    btnCopy.addEventListener('click', () => {
        const txt = generarResumenTexto();
        navigator.clipboard.writeText(txt)
            .then(() => alert('Resumen copiado al portapapeles.'));
    });

    // === Reiniciar datos ===
    btnReset.addEventListener('click', () => {
        if (confirm('¿Borrar todas las respuestas y volver al inicio?')) {
            resetData();
            location.href = 'index.php';
        }
    });

    // === Ver estadísticas globales ===
    btnStats.addEventListener('click', () => {
        location.href = 'estadisticas.php';
    });
});

// === Mostrar resultados de todos los bloques ===
function renderResults() {
    const summaryDiv = document.getElementById('summary');
    const estadisticas = JSON.parse(localStorage.getItem('estadisticas')) || [];
    const resultadosGlobales = JSON.parse(localStorage.getItem('estadisticasGlobales')) || { bajo: 0, medio: 0, alto: 0 };

    if (estadisticas.length === 0) {
        summaryDiv.innerHTML = `<p>No hay datos registrados. Por favor complete la evaluación.</p>`;
        return;
    }

    let html = '<ul>';
    estadisticas.forEach((bloque, i) => {
        html += `<li><strong>Bloque ${i + 1}:</strong> ${bloque.nivel} (${bloque.puntaje} puntos)</li>`;
    });
    html += '</ul>';

    // Resultados globales
    html += `
        <p><strong>Resumen general:</strong></p>
        <ul>
            <li>Riesgo Bajo: ${resultadosGlobales.bajo}</li>
            <li>Riesgo Medio: ${resultadosGlobales.medio}</li>
            <li>Riesgo Alto: ${resultadosGlobales.alto}</li>
        </ul>
    `;
    summaryDiv.innerHTML = html;

    renderDonutChart(resultadosGlobales);
}


// === Lectura por voz ===
function leerResultados() {
    const resumen = generarResumenTexto();
    const speech = new SpeechSynthesisUtterance(resumen);
    speech.lang = 'es-ES';
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}

// === Resetear datos ===
function resetData() {
    localStorage.removeItem('estadisticas');
    localStorage.removeItem('estadisticasGlobales');
}

// === Render Donut ===
function renderDonutChart(data) {
    const ctx = document.getElementById('donut').getContext('2d');
    const total = data.bajo + data.medio + data.alto;
    if (total === 0) return;

    const values = [data.bajo, data.medio, data.alto];
    const colors = ['#4caf50', '#ff9800', '#f44336'];
    const labels = ['Bajo', 'Medio', 'Alto'];

    let startAngle = 0;
    values.forEach((val, i) => {
        const sliceAngle = (val / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(210, 210);
        ctx.arc(210, 210, 200, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        startAngle += sliceAngle;
    });

    const legend = document.getElementById('legend');
    legend.innerHTML = labels.map((l, i) => `
        <div><span style="display:inline-block;width:20px;height:20px;background:${colors[i]};margin-right:8px;"></span>${l}: ${values[i]}</div>
    `).join('');
}
