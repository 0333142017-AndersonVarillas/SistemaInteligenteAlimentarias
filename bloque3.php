<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Bloque 3 - Evaluación</title>
        <link rel="stylesheet" href="styles.css">
        <link href="styles/PortadaSistema.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        <main class="container">
            <a class="back" href="index.php">← Volver</a>
            <section class="card">
                <h2 id="titulo">Bloque 3: Procesos de Producción</h2>
                <form id="form-questions"></form>
                <div class="actions">
                    <a class="btn" href="bloque2.php">Regresar: Bloque 2</a>
                    <a class="btn" href="bloque4.php">Siguiente: Bloque 4</a>
                </div>
            </section>
        </main>

        <!-- JS -->
        <script src="JSP/db.js"></script>
        <script src="JSP/app2.js"></script>
        <script>
            // 1️⃣ Genera dinámicamente las preguntas del Bloque 3 (índice 2)
            renderQuestions(2);

            // 2️⃣ Inicializa la carga de respuestas guardadas y validación
            initBlock('bloque3');

            // 3️⃣ Botón "Guardar y Siguiente"
            document.getElementById('save').addEventListener('click', function (e) {
                e.preventDefault();
                const form = document.getElementById('form-questions');
                const inputs = form.querySelectorAll('input[type="number"]');
                const data = {};
                inputs.forEach(inp => data[inp.name] = Number(inp.value) || 0);
                localStorage.setItem('bloque3', JSON.stringify(data));
                alert('✅ Respuestas del Bloque 3 guardadas.');
                window.location.href = 'bloque4.php';
            });
        </script>
    </body>
</html>
