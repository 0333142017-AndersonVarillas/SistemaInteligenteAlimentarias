<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Bloque 4 - Evaluación</title>
        <link rel="stylesheet" href="styles.css">
        <link href="styles/PortadaSistema.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        <main class="container">
            <a class="back" href="index.php">← Volver</a>
            <section class="card">
                <h2 id="titulo">Bloque 4: Limpieza y Desinfección</h2>
                <form id="form-questions"></form>
                <div class="actions">
                    <a class="btn" href="bloque3.php">Regresar: Bloque 3</a>
                    <a class="btn" href="resultados.php">Ir a Resultados</a>
                </div>
            </section>
        </main>

        <!-- JS -->
        <script src="JSP/db.js"></script>
        <script src="JSP/app2.js"></script>
        <script>
            // 1️⃣ Genera dinámicamente las preguntas del Bloque 4 (índice 3)
            renderQuestions(3);

            // 2️⃣ Inicializa la carga de respuestas guardadas y validación
            initBlock('bloque4');

            // 3️⃣ Botón "Guardar y Ver Resultados"
            document.getElementById('save').addEventListener('click', function (e) {
                e.preventDefault();
                const form = document.getElementById('form-questions');
                const inputs = form.querySelectorAll('input[type="number"]');
                const data = {};
                inputs.forEach(inp => data[inp.name] = Number(inp.value) || 0);
                localStorage.setItem('bloque4', JSON.stringify(data));
                alert('✅ Respuestas del Bloque 4 guardadas.');
                window.location.href = 'resultados.php';
            });
        </script>
    </body>
</html>
