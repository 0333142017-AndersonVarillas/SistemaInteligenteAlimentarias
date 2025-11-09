// db.js
// === Base de datos de preguntas para el sistema inteligente de evaluación ===

const DB = [
    // --- Bloque 1: Higiene del Personal ---
    [
        '¿El personal usa guantes y mascarillas apropiadas?',
        '¿Se realiza el lavado de manos según protocolo?',
        '¿El uniforme está limpio y en buen estado?',
        '¿Se controla la salud del personal regularmente?',
        '¿Se aplican buenas prácticas de manipulación de alimentos?'
    ],
    // --- Bloque 2: Control de Materias Primas ---
    [
        '¿Las materias primas cuentan con registro de proveedor?',
        '¿Se revisan fechas de caducidad antes de ingresar al almacén?',
        '¿Se controla la trazabilidad de lotes?',
        '¿Se almacenan las materias primas en condiciones adecuadas?',
        '¿Se realizan inspecciones de calidad al recibir insumos?'
    ],
    // --- Bloque 3: Procesos de Producción ---
    [
        '¿Se siguen procedimientos estandarizados de producción?',
        '¿Se mantienen controles de temperatura en procesos críticos?',
        '¿Se evita la contaminación cruzada entre productos?',
        '¿El equipo se calibra periódicamente?',
        '¿Se registra la producción con sus incidencias?'
    ],
    // --- Bloque 4: Limpieza y Desinfección ---
    [
        '¿Existe programa documentado de limpieza y desinfección?',
        '¿Se usan productos autorizados y etiquetados?',
        '¿Se verifica la eficacia de la limpieza (tests)?',
        '¿Hay cronograma y responsables claros?',
        '¿El personal está capacitado en limpieza y desinfección?'
    ]
];

// === Función auxiliar para generar preguntas dinámicamente en cada bloque ===
function renderQuestions(blockIndex) {
    const form = document.querySelector('form');
    if (!form)
        return;

    const preguntas = DB[blockIndex];
    form.innerHTML = `
      <div class="encuestado-id">
        <label for="encuestadoId">Ingrese el Numero de PC:</label><br>
        <input type="text" id="encuestadoId" name="encuestadoId" required placeholder="">
      </div>
    `;

    preguntas.forEach((pregunta, i) => {
        const div = document.createElement('div');
        div.className = 'pregunta';
        div.innerHTML = `
            <label class="question" for="p${i + 1}">${pregunta}</label><br>
            <div class="radios">
                <label><input type="radio" name="p${i + 1}" value="1" required> Sí</label>
                <label><input type="radio" name="p${i + 1}" value="0"> No</label>
            </div>
        `;
        form.appendChild(div);
    });

    // Agregar botón de guardar al final
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = '💾 Guardar respuestas';
    form.appendChild(btn);
}

// === NUEVA FUNCIÓN ===
// Registrar resultados globales (se acumulan en localStorage)
function registrarResultadoGlobal(resultadoFinal) {
    const data = JSON.parse(localStorage.getItem('estadisticasGlobales')) || {
        bajo: 0,
        medio: 0,
        alto: 0
    };

    if (resultadoFinal === 'bajo')
        data.bajo++;
    else if (resultadoFinal === 'medio')
        data.medio++;
    else if (resultadoFinal === 'alto')
        data.alto++;

    localStorage.setItem('estadisticasGlobales', JSON.stringify(data));
}

// Exportar para uso global
window.DB = DB;
window.renderQuestions = renderQuestions;
window.registrarResultadoGlobal = registrarResultadoGlobal;
