<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Sistema Inteligente Industrias Alimentarias</title>
        <link rel="stylesheet" href="styles.css">
        <link href="styles/PortadaSistema.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        <header class="site-header">
            <h1>CUESTIONARIO</h1>
            <p class="lead">Completa los 4 bloques de preguntas. Al final verás un gráfico contabilisada.</p>
        </header>

        <main class="container">
            <section class="card">
                <h2>Instrucciones</h2>
                <ol>
                    <li>Haz clic en cada bloque y responde las 5 preguntas (solo elige si o no).</li>
                    <li>Cada bloque guarda automáticamente en el navegador (localStorage).</li>
                    <li>Cuando termines, pulsa "Ver resultados" para ver el gráfico de riesgo.</li>
                </ol>
                
                
                
                <div class="grid">
                    <a class="btn" href="bloque1.php">ENTRAR EN EL CUESTIONARIO</a>
                </div>
                
                
                
                <div class="actions">
                    <a class="btn primary" href="resultados.php">Ver Resultados</a>
                    <button id="reset" class="btn danger">Delete</button>
                </div>
            </section>

        </main>

        <!-- JS -->
        <script src="JSP/app.js"></script>
        <script>
            // Cargar estado de todos los bloques
            loadIndexStatus();

            // Botón para borrar todo y recargar
            document.getElementById('reset').addEventListener('click', function () {
                resetData();
            });
        </script>
    </body>
</html>
