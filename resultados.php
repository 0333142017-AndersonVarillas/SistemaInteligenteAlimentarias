<!doctype html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Resultados - Sistema Evaluación</title>
        <link rel="stylesheet" href="styles.css">
        <link href="styles/PortadaSistema.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        <header class="site-header">
            <h1>Sistema Inteligente - Resultados</h1>
            <p class="lead">Resumen de evaluación y recomendaciones con lectura automática.</p>
        </header>

        <main class="container">
            <a class="btn" href="index.php">← REGRESAR AL INICIO</a>
            <a class="btn" href="bloque4.php">Regresar: Bloque 4</a>

            <section class="card">
                <h2>Resultados generales</h2>
                <div id="summary"></div>

                <div class="canvas-wrap">
                    <canvas id="donut" width="420" height="420" aria-label="Gráfico de riesgo" role="img"></canvas>
                </div>

                <div id="legend" class="legend"></div>

                <div class="actions" style="justify-content:center; margin-top:18px;">
                    <button class="btn primary" id="btn-tts">🔊 Escuchar Interpretacion</button>
                    <button class="btn" id="btn-copy">📋 Copia </button>
                    <button class="btn danger" id="btn-reset">🗑️ Delete</button>
                    <button class="btn success" id="btn-stats">📊 Ver estadísticas del Cuestionario</button>
                </div>
            </section>

            <footer class="site-footer">Sistema de evaluación</footer>
        </main>

        <script src="JSP/resultados.js" type="text/javascript"></script>
        <script src="JSP/app.js" type="text/javascript"></script>
        <script src="JSP/db.js" type="text/javascript"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                renderResults();

                document.getElementById('btn-tts').addEventListener('click', leerResultados);
                document.getElementById('btn-copy').addEventListener('click', () => {
                    const txt = generarResumenTexto();
                    navigator.clipboard.writeText(txt).then(() => alert('Resumen copiado al portapapeles.'));
                });
                document.getElementById('btn-reset').addEventListener('click', () => {
                    if (confirm('¿Borrar todas las respuestas y volver al inicio?')) {
                        resetData();
                        location.href = 'index.php';
                    }
                });

                // Nuevo botón de estadísticas
                document.getElementById('btn-stats').addEventListener('click', () => {
                    location.href = 'estadisticas.php';
                });
            });
        </script>
    </body>
</html>
