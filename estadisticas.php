<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gráfica de Resultados</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="styles/PortadaSistema.css" rel="stylesheet" type="text/css"/>
</head>
<body class="bg-light">
    <div class="container py-5">
        <h1 class="text-center mb-4">📊 Seguimiento del Cuestionario</h1>

        <div class="card shadow-sm p-4">
            <canvas id="barChart" width="400" height="200"></canvas>
            <p id="totalParticipantes" class="text-center mt-3 fw-bold text-primary"></p>
        </div>

        <div class="text-center mt-4">
            <button class="btn btn-success" onclick="renderChart()">Actualizar ahora</button>
            <a href="resultados.php" class="btn btn-secondary ms-2">Volver a los Resultados</a>
        </div>
    </div>

    <script src="JSP/app.js" type="text/javascript"></script>
    <script src="JSP/db.js" type="text/javascript"></script>
    <script src="JSP/estadisticas.js" type="text/javascript"></script>
</body>
</html>
