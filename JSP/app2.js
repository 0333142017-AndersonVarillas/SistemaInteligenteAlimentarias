// app.js
// === Lógica común para todos los HTML ===

// --- Inicializar un bloque de preguntas ---
function initBlock(blockName) {
    const form = document.querySelector('form');
    const saved = JSON.parse(localStorage.getItem(blockName)) || {};
    const preguntas = document.querySelectorAll('.pregunta');

    // Cambiar los inputs tipo number a botones Sí/No
    preguntas.forEach((div, i) => {
        const name = 'p' + (i + 1);
        // Si no existe el input, lo crea
        if (!div.querySelector('input[name="' + name + '"]')) {
            div.innerHTML += `
                <div class="radios">
                    <label><input type="radio" name="${name}" value="1"> Sí</label>
                    <label><input type="radio" name="${name}" value="0"> No</label>
                </div>
            `;
        }
    });

    const inputs = form.querySelectorAll('input[type="radio"]');

    // Cargar respuestas guardadas
    inputs.forEach(inp => {
        if (saved[inp.name] !== undefined && Number(saved[inp.name]) === Number(inp.value))
            inp.checked = true;
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const encuestadoIdInput = form.querySelector('#encuestadoId');
        const encuestadoId = encuestadoIdInput ? encuestadoIdInput.value.trim() : null;
        if (!encuestadoId) {
            alert('Por favor ingresa el ID del encuestado.');
            return;
        }

        const data = {};
        inputs.forEach(inp => {
            if (inp.checked)
                data[inp.name] = Number(inp.value);
        });

        // --- NUEVO: registrar bloque por ID y verificar límite ---
        const blockIndex = Number(blockName.slice(-1)) - 1; // asume bloque1..4
        const res = registerBlockForId(encuestadoId, blockIndex);
        if (!res.ok) {
            alert(res.msg);
            return;
        }

        const key = `${encuestadoId}_${blockName}`;
        localStorage.setItem(key, JSON.stringify(data));

        alert('✅ Respuestas guardadas para ' + encuestadoId + ' en ' + blockName + (res.completed ? ' — Encuestado COMPLETÓ los 4 bloques.' : ''));

        // Si el encuestado completó los 4 bloques, podrías registrar resultado global
        if (res.completed) {
            // Ejemplo: asignar nivel según porcentaje general (ajústalo según tu lógica)
            const {overallPct} = computeResults();
            let nivel = 'medio';
            if (overallPct <= 40)
                nivel = 'bajo';
            else if (overallPct > 70)
                nivel = 'alto';
            registrarResultadoGlobal(nivel);
        }
    });
}

// --- Renderizar resultados ---
function renderResults() {
    const blocks = ['bloque1', 'bloque2', 'bloque3', 'bloque4'];
    const allKeys = Object.keys(localStorage);
    const totals = [];
    const summary = document.getElementById('summary');
    summary.innerHTML = '';

    let globalSum = 0;
    let count = 0;

    blocks.forEach(b => {
        // Buscar la última clave que contenga este bloque (por ID)
        const key = allKeys.find(k => k.endsWith('_' + b) || k === b);
        const data = key ? JSON.parse(localStorage.getItem(key)) : {};
        const values = Object.values(data);
        const total = values.reduce((a, b) => a + b, 0);
        totals.push(total);
        globalSum += total;
        count += 5;
        const pct = (total / 5) * 100;
        const p = document.createElement('p');
        p.textContent = `Bloque ${b.slice(-1)}: ${total} respuestas positivas (${pct.toFixed(1)}%)`;
        summary.appendChild(p);
    });

    const blockMax = 5;
    const overallPct = (globalSum / (blockMax * 4)) * 100;
    let estado = '';
    if (overallPct <= 40)
        estado = '🔴 ALTO RIESGO';
    else if (overallPct <= 70)
        estado = '🟡 RIESGO MEDIO';
    else
        estado = '🟢 BUEN ESTADO';

    const estadoP = document.createElement('p');
    estadoP.innerHTML = `<strong>Estado general:</strong> ${estado}`;
    summary.appendChild(estadoP);

    // --- Gráfico tipo donut ---
    const canvas = document.getElementById('donut');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 110;

    const colorFor = p => {
        if (p <= 40)
            return '#e63946';
        if (p <= 70)
            return '#f4a261';
        return '#2a9d8f';
    };

    let startAngle = -Math.PI / 2;
    const legend = document.getElementById('legend');
    legend.innerHTML = '';

    totals.forEach((t, i) => {
        const pct = (t * 100) / blockMax;
        const sweep = (pct / 100) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sweep);
        ctx.closePath();
        ctx.fillStyle = colorFor(pct);
        ctx.fill();
        startAngle += sweep;

        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `<div class="sw" style="background:${colorFor(pct)}"></div> Bloque ${i + 1}: ${Math.round(pct)}%`;
        legend.appendChild(item);
    });

    ctx.beginPath();
    ctx.fillStyle = '#f7f8fa';
    ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '18px Arial';
    ctx.fillStyle = '#0f1724';
    ctx.textAlign = 'center';
    ctx.fillText(overallPct.toFixed(1) + '%', centerX, centerY + 6);
}


// --- Para index.html: mostrar estado ---
function loadIndexStatus() {
    const blocks = ['bloque1', 'bloque2', 'bloque3', 'bloque4'];
    const list = document.getElementById('statusList');
    if (!list)
        return;
    list.innerHTML = '';

    blocks.forEach(b => {
        const data = JSON.parse(localStorage.getItem(b)) || {};
        const isDone = Object.keys(data).length === 5;
        const li = document.createElement('li');
        li.textContent = `${b.toUpperCase()}: ${isDone ? '✅ Completado' : '⌛ Pendiente'}`;
        list.appendChild(li);
    });
}

// --- Resetear todo ---
function resetData() {
    if (confirm('¿Seguro que deseas borrar todas las respuestas?')) {
        ['bloque1', 'bloque2', 'bloque3', 'bloque4'].forEach(b => localStorage.removeItem(b));
        alert('🗑️ Datos borrados correctamente.');
        location.reload();
    }
}

// Exportar funciones globalmente
window.initBlock = initBlock;
window.renderResults = renderResults;
window.loadIndexStatus = loadIndexStatus;
window.resetData = resetData;


/* ===================================================================
 AÑADIDO: funciones de cálculo reutilizable, TTS y consejos personalizados
 =================================================================== */
function computeResults() {
    const keys = ['bloque1', 'bloque2', 'bloque3', 'bloque4'];
    const blockMax = 5;
    const totals = [];
    let grandTotal = 0;

    keys.forEach(k => {
        const raw = localStorage.getItem(k);
        if (!raw) {
            totals.push(0);
            return;
        }
        try {
            const obj = JSON.parse(raw);
            const sum = Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0);
            totals.push(sum);
            grandTotal += sum;
        } catch (e) {
            totals.push(0);
        }
    });

    const grandMax = blockMax * 4;
    const overallPct = grandMax ? (grandTotal / grandMax) * 100 : 0;
    return {totals, grandTotal, grandMax, overallPct, blockMax};
}

/* ============================================================
 🔊 SINCRONIZACIÓN DE IA DE VOZ CON RESULTADOS VISUALES
============================================================ */
function obtenerDatos() {
    const blocks = ['bloque1', 'bloque2', 'bloque3', 'bloque4'];
    const allKeys = Object.keys(localStorage);
    const blockMax = 5;
    let resultados = [];

    blocks.forEach((b, i) => {
        const key = allKeys.find(k => k.endsWith('_' + b) || k === b);
        const data = key ? JSON.parse(localStorage.getItem(key)) : {};
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        resultados.push({ bloque: i + 1, total, max: blockMax });
    });

    return resultados;
}

async function interpretarResultados() {
    const resultados = obtenerDatos();
    const prompt = `
    Analiza los siguientes resultados por bloques y genera un análisis global.
    Sé interpretativo y profesional, no solo numérico.
    Resultados: ${JSON.stringify(resultados)}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "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"
        },
        body: JSON.stringify({
            model: "gpt-5",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    const texto = data.choices[0].message.content;
    return texto;
}

async function leerResultadosIA() {
    if (!('speechSynthesis' in window)) {
        alert('Tu navegador no soporta síntesis de voz.');
        return;
    }

    const texto = await interpretarResultados();
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'es-ES';
    utter.rate = 0.95;
    utter.pitch = 1;

    window.speechSynthesis.speak(utter);
}



/* ===================================================================
 NUEVO BLOQUE: Gestión de encuestados únicos y límite de 50 personas
 =================================================================== */
const MAX_RESPONDENTS = 50;
const RESPONDENTS_KEY = 'respondents_v1';

function getRespondents() {
    try {
        return JSON.parse(localStorage.getItem(RESPONDENTS_KEY)) || {};
    } catch (e) {
        return {};
    }
}
function saveRespondents(obj) {
    localStorage.setItem(RESPONDENTS_KEY, JSON.stringify(obj));
}
function completedRespondentsCount() {
    const r = getRespondents();
    return Object.values(r).filter(x => x.completedAt).length;
}
function registerBlockForId(encuestadoId, blockIndex) {
    if (!encuestadoId)
        return {ok: false, msg: 'ID requerido'};
    const r = getRespondents();
    const id = String(encuestadoId).trim();
    if (!r[id]) {
        r[id] = {bloque1: false, bloque2: false, bloque3: false, bloque4: false, completedAt: null};
    }
    r[id]['bloque' + (blockIndex + 1)] = true;
    const allDone = r[id].bloque1 && r[id].bloque2 && r[id].bloque3 && r[id].bloque4;
    if (allDone && !r[id].completedAt) {
        const completedCount = completedRespondentsCount();
        if (completedCount >= MAX_RESPONDENTS) {
            return {ok: false, msg: `Límite alcanzado: ${MAX_RESPONDENTS} encuestados completados.`};
        }
        r[id].completedAt = new Date().toISOString();
    }
    saveRespondents(r);
    return {ok: true, msg: 'Bloque registrado', completed: r[id].completedAt ? true : false};
}
function resetRespondents() {
    if (!confirm('¿Resetear lista de encuestados completados?'))
        return;
    localStorage.removeItem(RESPONDENTS_KEY);
    alert('Lista de encuestados reiniciada.');
}

// === Función que guarda el resultado del bloque actual con número de encuestador ===
function registrarResultadoGlobal(resultadoFinal, bloqueIndex) {
    // Número de encuestador actual (de 1 a 50)
    let encuestador = parseInt(localStorage.getItem('encuestadorActual')) || 1;

    // Guardamos el resultado individual del bloque para ese encuestador
    localStorage.setItem(`resultadoBloque${bloqueIndex + 1}_encuestador${encuestador}`, JSON.stringify({
        nivel: resultadoFinal
    }));

    // Cuando el encuestador termine los 4 bloques, pasamos al siguiente
    if (bloqueIndex === 3) {
        if (encuestador < 50) {
            localStorage.setItem('encuestadorActual', encuestador + 1);
        }
    }
}


window.registerBlockForId = registerBlockForId;
window.completedRespondentsCount = completedRespondentsCount;
window.resetRespondents = resetRespondents;
window.MAX_RESPONDENTS = MAX_RESPONDENTS;



