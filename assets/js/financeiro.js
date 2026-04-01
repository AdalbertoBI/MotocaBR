/**/**/**const MAX_REGISTROS = 200;

 * financeiro.js - Modulo de controle financeiro do Motoca BR

 * Usa IndexedDB via MotocaDB (db.js) em vez do localStorage. * financeiro.js — Módulo de controle financeiro do Motoca BR

 */

 * Usa IndexedDB via MotocaDB (db.js) em vez do localStorage. * financeiro.js — Módulo de controle financeiro do Motoca BRconst STORAGE_EXPIRATION_DAYS = 90;

'use strict';

 */

// --- utilitarios locais ------------------------------------------------------

 * Usa IndexedDB via MotocaDB (db.js) em vez do localStorage.

function debounce(func, wait) {

    var timeout;// ─── utilitários locais ───────────────────────────────────────────────────────

    return function () {

        var args = arguments; */function debounce(func, wait) {

        var ctx  = this;

        clearTimeout(timeout);function debounce(func, wait) {

        timeout = setTimeout(function () { func.apply(ctx, args); }, wait);

    };    let timeout;    let timeout;

}

    return function (...args) {

function getWeekNumber(d) {

    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));        clearTimeout(timeout);// ─── utilitários locais ───────────────────────────────────────────────────────    return function (...args) {

    var day = (d.getUTCDay() + 6) % 7;

    d.setUTCDate(d.getUTCDate() - day + 3);        timeout = setTimeout(() => func.apply(this, args), wait);

    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);    };        const context = this;

}

}

// --- inicializacao -----------------------------------------------------------

function debounce(func, wait) {        clearTimeout(timeout);

document.addEventListener('DOMContentLoaded', async function () {

    console.log('[financeiro.js] Iniciando modulo financeiro...');function getWeekNumber(d) {

    try {

        await MotocaDB.init();    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));    let timeout;        timeout = setTimeout(() => func.apply(context, args), wait);

    } catch (e) {

        console.error('[financeiro.js] Falha ao inicializar IndexedDB:', e);    const day = (d.getUTCDay() + 6) % 7;

        showToast('Erro ao abrir banco de dados.', 'error');

    }    d.setUTCDate(d.getUTCDate() - day + 3);    return function (...args) {    };

    await carregarConfiguracoes();

    await carregarRegistros();    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    configurarEventos();

    await atualizarSemanas();    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);        clearTimeout(timeout);}

});

}

// --- eventos -----------------------------------------------------------------

        timeout = setTimeout(() => func.apply(this, args), wait);

function configurarEventos() {

    var kmInput    = document.getElementById('kmPorLitro');// ─── inicialização ────────────────────────────────────────────────────────────

    var precoInput = document.getElementById('precoPorLitro');

    var semanaEl   = document.getElementById('semanaConsulta');    };function checkStorageAvailability(data) {

    var btnGanho   = document.getElementById('btnSalvarGanho');

    var btnGasto   = document.getElementById('btnSalvarGasto');document.addEventListener('DOMContentLoaded', async () => {

    var btnCancel  = document.getElementById('btnCancelarEdicao');

    console.log('[financeiro.js] DOM carregado. Iniciando módulo financeiro...');}    try {

    var debouncedKm    = debounce(salvarKmPorLitro, 1000);

    var debouncedPreco = debounce(salvarPrecoPorLitro, 1000);



    if (kmInput) {    try {        const testKey = '__test__';

        kmInput.addEventListener('input', debouncedKm);

        kmInput.addEventListener('blur',  salvarKmPorLitro);        await MotocaDB.init();

    }

    if (precoInput) {    } catch (e) {function showToast(message, type = 'success') {        const testData = JSON.stringify(data);

        precoInput.addEventListener('input', debouncedPreco);

        precoInput.addEventListener('blur',  salvarPrecoPorLitro);        console.error('[financeiro.js] Falha ao inicializar IndexedDB:', e);

    }

    if (btnGanho)  btnGanho.addEventListener('click', function () { salvarRegistro('ganho'); });        showToast('Erro ao abrir banco de dados. Alguns dados podem não ser salvos.', 'error');    const toast = document.createElement('div');        localStorage.setItem(testKey, testData);

    if (btnGasto)  btnGasto.addEventListener('click', function () { salvarRegistro('gasto'); });

    if (btnCancel) btnCancel.addEventListener('click', cancelarEdicao);    }

    if (semanaEl)  semanaEl.addEventListener('change', carregarRegistros);

}    toast.className = `toast ${type}`;        localStorage.removeItem(testKey);



// --- configuracoes -----------------------------------------------------------    await carregarConfiguracoes();



async function carregarConfiguracoes() {    await carregarRegistros();    toast.textContent = message;        let totalSize = 0;

    var kmInput    = document.getElementById('kmPorLitro');

    var precoInput = document.getElementById('precoPorLitro');    configurarEventos();

    var km    = await MotocaDB.getConfig('kmPorLitro');

    var preco = await MotocaDB.getConfig('precoPorLitro');    await atualizarSemanas();    toast.setAttribute('role', 'alert');        for (let key in localStorage) {

    if (kmInput    && km)    kmInput.value    = km;

    if (precoInput && preco) precoInput.value = preco;});

}

    toast.setAttribute('aria-live', 'assertive');            if (localStorage.hasOwnProperty(key)) {

async function salvarKmPorLitro() {

    var input    = document.getElementById('kmPorLitro');// ─── eventos ─────────────────────────────────────────────────────────────────

    var feedback = document.getElementById('kmPorLitroFeedback');

    if (!input || !feedback) return;    Object.assign(toast.style, {                totalSize += ((localStorage[key].length + key.length) * 2);



    var val = parseFloat(input.value);function configurarEventos() {

    feedback.className   = 'form-text';

    feedback.textContent = '';    console.log('[financeiro.js] Configurando eventos...');        position:     'fixed',            }



    if (isNaN(val) || val <= 0) {

        feedback.className   = 'form-text text-danger';

        feedback.textContent = 'Insira um valor valido maior que 0.';    const kmPorLitroInput    = document.getElementById('kmPorLitro');        bottom:       '20px',        }

        input.classList.remove('saved');

        return;    const precoPorLitroInput = document.getElementById('precoPorLitro');

    }

    if (val > 100) {    const semanaConsulta     = document.getElementById('semanaConsulta');        right:        '20px',        if (totalSize > 4 * 1024 * 1024) {

        feedback.className   = 'form-text text-warning';

        feedback.textContent = 'Valor alto detectado. Confirme se esta correto.';

    }

    try {    const debouncedKm    = debounce(salvarKmPorLitro, 1000);        padding:      '10px 20px',            console.warn('[financeiro.js] localStorage próximo do limite:', totalSize / (1024 * 1024), 'MB');

        await MotocaDB.setConfig('kmPorLitro', val.toString());

        feedback.className   = 'form-text text-success';    const debouncedPreco = debounce(salvarPrecoPorLitro, 1000);

        feedback.textContent = 'Consumo salvo!';

        input.classList.add('saved');        background:   type === 'success' ? '#28a745' : '#dc3545',            try {

        showToast('Consumo salvo!', 'success');

    } catch (e) {    if (kmPorLitroInput) {

        feedback.className   = 'form-text text-danger';

        feedback.textContent = 'Erro ao salvar consumo.';        kmPorLitroInput.addEventListener('input', debouncedKm);        color:        '#fff',                localStorage.removeItem('cacheBusca');

        input.classList.remove('saved');

        showToast('Erro ao salvar consumo.', 'error');        kmPorLitroInput.addEventListener('blur', salvarKmPorLitro);

        console.error('[financeiro.js] Erro kmPorLitro:', e);

    }    } else {        borderRadius: '8px',                console.log('[financeiro.js] cacheBusca removido para liberar espaço.');

}

        console.warn('[financeiro.js] Input #kmPorLitro não encontrado.');

async function salvarPrecoPorLitro() {

    var input    = document.getElementById('precoPorLitro');    }        zIndex:       '1000',                totalSize = 0;

    var feedback = document.getElementById('precoPorLitroFeedback');

    if (!input || !feedback) return;



    var val = parseFloat(input.value);    if (precoPorLitroInput) {        boxShadow:    '0 2px 8px rgba(0,0,0,0.25)',                for (let key in localStorage) {

    feedback.className   = 'form-text';

    feedback.textContent = '';        precoPorLitroInput.addEventListener('input', debouncedPreco);



    if (isNaN(val) || val <= 0) {        precoPorLitroInput.addEventListener('blur', salvarPrecoPorLitro);        fontSize:     '0.95rem',                    if (localStorage.hasOwnProperty(key)) {

        feedback.className   = 'form-text text-danger';

        feedback.textContent = 'Insira um valor valido maior que 0.';    } else {

        input.classList.remove('saved');

        return;        console.warn('[financeiro.js] Input #precoPorLitro não encontrado.');        maxWidth:     '280px',                        totalSize += ((localStorage[key].length + key.length) * 2);

    }

    if (val > 50) {    }

        feedback.className   = 'form-text text-warning';

        feedback.textContent = 'Preco alto detectado. Confirme se esta correto.';    });                    }

    }

    try {    const btnSalvarGanho  = document.getElementById('btnSalvarGanho');

        await MotocaDB.setConfig('precoPorLitro', val.toString());

        feedback.className   = 'form-text text-success';    const btnSalvarGasto  = document.getElementById('btnSalvarGasto');    document.body.appendChild(toast);                }

        feedback.textContent = 'Preco salvo!';

        input.classList.add('saved');    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

        showToast('Preco salvo!', 'success');

    } catch (e) {    setTimeout(() => toast.remove(), 3000);                if (totalSize > 4 * 1024 * 1024) {

        feedback.className   = 'form-text text-danger';

        feedback.textContent = 'Erro ao salvar preco.';    if (btnSalvarGanho)    btnSalvarGanho.addEventListener('click', () => salvarRegistro('ganho'));

        input.classList.remove('saved');

        showToast('Erro ao salvar preco.', 'error');    if (btnSalvarGasto)    btnSalvarGasto.addEventListener('click', () => salvarRegistro('gasto'));}                    let registros = decompressData(localStorage.getItem('registros') || compressData([]));

        console.error('[financeiro.js] Erro precoPorLitro:', e);

    }    if (btnCancelarEdicao) btnCancelarEdicao.addEventListener('click', cancelarEdicao);

}

                    if (registros.length > MAX_REGISTROS) registros = registros.slice(-MAX_REGISTROS);

// --- CRUD de registros -------------------------------------------------------

    if (semanaConsulta) {

async function salvarRegistro(tipo) {

    var btnGanho      = document.getElementById('btnSalvarGanho');        semanaConsulta.addEventListener('change', carregarRegistros);function getWeekNumber(d) {                    localStorage.setItem('registros', compressData(registros));

    var btnGasto      = document.getElementById('btnSalvarGasto');

    var descInput     = document.getElementById('descricaoRegistro');    }

    var valorInput    = document.getElementById('valorRegistro');

    var idEdicaoInput = document.getElementById('indiceEdicao');}    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));                    console.log('[financeiro.js] registros reduzidos para liberar espaço.');

    var descFeedback  = document.getElementById('descricaoRegistroFeedback');

    var valorFeedback = document.getElementById('valorRegistroFeedback');



    if (!descInput || !valorInput || !idEdicaoInput || !descFeedback || !valorFeedback) {// ─── configurações (km/litro, preço/litro) ───────────────────────────────────    const day = (d.getUTCDay() + 6) % 7;                    totalSize = 0;

        console.error('[financeiro.js] Elementos de registro nao encontrados.');

        return;

    }

async function carregarConfiguracoes() {    d.setUTCDate(d.getUTCDate() - day + 3);                    for (let key in localStorage) {

    if (btnGanho) btnGanho.disabled = true;

    if (btnGasto) btnGasto.disabled = true;    const kmInput    = document.getElementById('kmPorLitro');



    var descricao = descInput.value.trim();    const precoInput = document.getElementById('precoPorLitro');    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));                        if (localStorage.hasOwnProperty(key)) {

    var valor     = parseFloat(valorInput.value);

    var idEdicao  = idEdicaoInput.value;



    descFeedback.textContent  = '';    const km    = await MotocaDB.getConfig('kmPorLitro');    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);                            totalSize += ((localStorage[key].length + key.length) * 2);

    valorFeedback.textContent = '';

    const preco = await MotocaDB.getConfig('precoPorLitro');

    var hasError = false;

    if (!descricao) {}                        }

        descFeedback.className   = 'form-text text-danger';

        descFeedback.textContent = 'Insira a descricao.';    if (kmInput    && km)    kmInput.value    = km;

        hasError = true;

    } else if (descricao.length > 50) {    if (precoInput && preco) precoInput.value = preco;                    }

        descFeedback.className   = 'form-text text-danger';

        descFeedback.textContent = 'A descricao deve ter ate 50 caracteres.';}

        hasError = true;

    }// ─── inicialização ────────────────────────────────────────────────────────────                    if (totalSize > 4 * 1024 * 1024) {

    if (isNaN(valor) || valor <= 0) {

        valorFeedback.className   = 'form-text text-danger';async function salvarKmPorLitro() {

        valorFeedback.textContent = 'Insira um valor valido maior que 0.';

        hasError = true;    const input    = document.getElementById('kmPorLitro');                        return false;

    }

    const feedback = document.getElementById('kmPorLitroFeedback');

    if (hasError) {

        if (btnGanho) btnGanho.disabled = false;    if (!input || !feedback) return;document.addEventListener('DOMContentLoaded', async () => {                    }

        if (btnGasto) btnGasto.disabled = false;

        return;

    }

    const val = parseFloat(input.value);    console.log('[financeiro.js] DOM carregado. Iniciando módulo financeiro...');                }

    try {

        if (idEdicao !== '') {    feedback.className  = 'form-text';

            await MotocaDB.updateRegistro(parseInt(idEdicao, 10), { tipo: tipo, descricao: descricao, valor: valor });

            cancelarEdicao();    feedback.textContent = '';            } catch (e) {

            showToast('Registro atualizado!', 'success');

        } else {

            await MotocaDB.addRegistro({ tipo: tipo, descricao: descricao, valor: valor, data: new Date().toISOString() });

            descInput.value  = '';    if (isNaN(val) || val <= 0) {    try {                console.error('[financeiro.js] Erro ao limpar cacheBusca ou dados:', e);

            valorInput.value = '';

            descFeedback.className   = 'form-text text-success';        feedback.className  = 'form-text text-danger';

            descFeedback.textContent = (tipo === 'gasto' ? 'Gasto' : 'Ganho') + ' registrado!';

            showToast((tipo === 'gasto' ? 'Gasto' : 'Ganho') + ' registrado!', 'success');        feedback.textContent = 'Insira um valor válido maior que 0.';        await MotocaDB.init();                return false;

        }

        await carregarRegistros();        input.classList.remove('saved');

    } catch (e) {

        descFeedback.className   = 'form-text text-danger';        return;    } catch (e) {            }

        descFeedback.textContent = 'Erro ao salvar registro.';

        showToast('Erro ao salvar registro.', 'error');    }

        console.error('[financeiro.js] Erro ao salvar:', e);

    } finally {    if (val > 100) {        console.error('[financeiro.js] Falha ao inicializar IndexedDB:', e);        }

        if (btnGanho) btnGanho.disabled = false;

        if (btnGasto) btnGasto.disabled = false;        feedback.className  = 'form-text text-warning';

    }

}        feedback.textContent = 'Valor alto detectado. Confirme se está correto.';        showToast('Erro ao abrir banco de dados. Alguns dados podem não ser salvos.', 'error');        return true;



async function editarRegistro(id) {    }

    var registros = await MotocaDB.getRegistros();

    var registro  = null;    }    } catch (e) {

    for (var i = 0; i < registros.length; i++) {

        if (registros[i].id === id) { registro = registros[i]; break; }    try {

    }

    if (!registro) {        await MotocaDB.setConfig('kmPorLitro', val.toString());        console.error('[financeiro.js] Espaço insuficiente no localStorage:', e);

        showToast('Registro nao encontrado.', 'error');

        return;        feedback.className  = 'form-text text-success';

    }

        feedback.textContent = 'Consumo salvo com sucesso!';    await carregarConfiguracoes();        try {

    var descInput     = document.getElementById('descricaoRegistro');

    var valorInput    = document.getElementById('valorRegistro');        input.classList.add('saved');

    var idEdicaoInput = document.getElementById('indiceEdicao');

    var btnCancel     = document.getElementById('btnCancelarEdicao');        showToast('Consumo salvo!', 'success');    await carregarRegistros();            localStorage.removeItem('cacheBusca');

    var btnGanho      = document.getElementById('btnSalvarGanho');

    var btnGasto      = document.getElementById('btnSalvarGasto');        console.log('[financeiro.js] Km por litro salvo:', val);

    var titulo        = document.getElementById('tituloRegistro');

    } catch (e) {    await atualizarSemanas();            let registros = decompressData(localStorage.getItem('registros') || compressData([]));

    if (descInput)     descInput.value     = registro.descricao || '';

    if (valorInput)    valorInput.value    = registro.valor ? registro.valor.toFixed(2) : '';        feedback.className  = 'form-text text-danger';

    if (idEdicaoInput) idEdicaoInput.value = id.toString();

    if (btnCancel)     btnCancel.style.display = 'inline-block';        feedback.textContent = 'Erro ao salvar consumo.';    configurarEventos();            if (registros.length > MAX_REGISTROS) registros = registros.slice(-MAX_REGISTROS);

    if (btnGanho)      btnGanho.textContent = registro.tipo === 'ganho' ? 'Salvar Alteracoes' : 'Adicionar Ganho';

    if (btnGasto)      btnGasto.textContent = registro.tipo === 'gasto' ? 'Salvar Alteracoes' : 'Adicionar Gasto';        input.classList.remove('saved');

    if (titulo)        titulo.textContent   = 'Editar Registro';

}        showToast('Erro ao salvar consumo.', 'error');            localStorage.setItem('registros', compressData(registros));



function cancelarEdicao() {        console.error('[financeiro.js] Erro ao salvar kmPorLitro:', e);

    var descInput     = document.getElementById('descricaoRegistro');

    var valorInput    = document.getElementById('valorRegistro');    }    console.log('[financeiro.js] Módulo financeiro pronto.');            console.log('[financeiro.js] cacheBusca removido e dados reduzidos após falha inicial.');

    var idEdicaoInput = document.getElementById('indiceEdicao');

    var btnCancel     = document.getElementById('btnCancelarEdicao');}

    var btnGanho      = document.getElementById('btnSalvarGanho');

    var btnGasto      = document.getElementById('btnSalvarGasto');});            return true;

    var descFeedback  = document.getElementById('descricaoRegistroFeedback');

    var valorFeedback = document.getElementById('valorRegistroFeedback');async function salvarPrecoPorLitro() {

    var titulo        = document.getElementById('tituloRegistro');

    const input    = document.getElementById('precoPorLitro');        } catch (e) {

    if (descInput)     descInput.value     = '';

    if (valorInput)    valorInput.value    = '';    const feedback = document.getElementById('precoPorLitroFeedback');

    if (idEdicaoInput) idEdicaoInput.value = '';

    if (btnCancel)     btnCancel.style.display = 'none';    if (!input || !feedback) return;// ─── configuração de eventos ──────────────────────────────────────────────────            console.error('[financeiro.js] Falha ao limpar dados:', e);

    if (btnGanho)      btnGanho.textContent = 'Adicionar Ganho';

    if (btnGasto)      btnGasto.textContent = 'Adicionar Gasto';

    if (descFeedback)  descFeedback.textContent  = '';

    if (valorFeedback) valorFeedback.textContent = '';    const val = parseFloat(input.value);            return false;

    if (titulo)        titulo.textContent   = 'Adicionar Registro';

}    feedback.className  = 'form-text';



async function removerRegistro(id) {    feedback.textContent = '';function configurarEventos() {        }

    if (!confirm('Deseja remover este registro?')) return;

    try {

        await MotocaDB.deleteRegistro(id);

        showToast('Registro removido!', 'success');    if (isNaN(val) || val <= 0) {    const kmPorLitroInput    = document.getElementById('kmPorLitro');    }

        await carregarRegistros();

    } catch (e) {        feedback.className  = 'form-text text-danger';

        showToast('Erro ao remover registro.', 'error');

        console.error('[financeiro.js] Erro ao remover:', e);        feedback.textContent = 'Insira um valor válido maior que 0.';    const precoPorLitroInput = document.getElementById('precoPorLitro');}

    }

}        input.classList.remove('saved');



async function removerRegistrosAgrupados(descricao) {        return;    const semanaConsulta     = document.getElementById('semanaConsulta');

    if (!confirm('Deseja remover todos os registros com a descricao "' + descricao + '"?')) return;

    try {    }

        await MotocaDB.deleteRegistrosByDescricao(descricao);

        showToast('Registros removidos!', 'success');    if (val > 50) {    const btnSalvarGanho     = document.getElementById('btnSalvarGanho');function compressData(data) {

        await carregarRegistros();

    } catch (e) {        feedback.className  = 'form-text text-warning';

        showToast('Erro ao remover registros.', 'error');

        console.error('[financeiro.js] Erro ao remover agrupados:', e);        feedback.textContent = 'Preço alto detectado. Confirme se está correto.';    const btnSalvarGasto     = document.getElementById('btnSalvarGasto');    try {

    }

}    }



// --- exibicao de registros ---------------------------------------------------    const btnCancelarEdicao  = document.getElementById('btnCancelarEdicao');        return JSON.stringify(data);



async function carregarRegistros() {    try {

    var listaEl  = document.getElementById('listaRegistros');

    var gastosEl = document.getElementById('totalGastos');        await MotocaDB.setConfig('precoPorLitro', val.toString());    } catch (e) {

    var ganhosEl = document.getElementById('totalGanhos');

    var saldoEl  = document.getElementById('saldoTotal');        feedback.className  = 'form-text text-success';

    var semanaEl = document.getElementById('semanaConsulta');

        feedback.textContent = 'Preço salvo com sucesso!';    if (kmPorLitroInput) {        console.error('[financeiro.js] Erro ao comprimir dados:', e);

    if (!listaEl || !gastosEl || !ganhosEl || !saldoEl || !semanaEl) return;

        input.classList.add('saved');

    try {

        var todos      = await MotocaDB.getRegistros();        showToast('Preço salvo!', 'success');        const debouncedSalvar = debounce(salvarKmPorLitro, 1000);        return JSON.stringify([]);

        var semanaSel  = semanaEl.value;

        var filtrados  = [];        console.log('[financeiro.js] Preço por litro salvo:', val);



        if (semanaSel) {    } catch (e) {        kmPorLitroInput.addEventListener('input', debouncedSalvar);    }

            var partes     = semanaSel.split('-');

            var ano        = parseInt(partes[0], 10);        feedback.className  = 'form-text text-danger';

            var semanaNum  = parseInt(partes[1], 10);

            for (var i = 0; i < todos.length; i++) {        feedback.textContent = 'Erro ao salvar preço.';        kmPorLitroInput.addEventListener('blur',  salvarKmPorLitro);}

                var d = new Date(todos[i].data);

                if (d.getUTCFullYear() === ano && getWeekNumber(d) === semanaNum) {        input.classList.remove('saved');

                    filtrados.push(todos[i]);

                }        showToast('Erro ao salvar preço.', 'error');    } else {

            }

        } else {        console.error('[financeiro.js] Erro ao salvar precoPorLitro:', e);

            var hoje       = new Date();

            var anoAtual   = hoje.getUTCFullYear();    }        console.warn('[financeiro.js] #kmPorLitro não encontrado.');function decompressData(compressed) {

            var semAtual   = getWeekNumber(hoje);

            for (var j = 0; j < todos.length; j++) {}

                var dj = new Date(todos[j].data);

                if (dj.getUTCFullYear() === anoAtual && getWeekNumber(dj) === semAtual) {    }    try {

                    filtrados.push(todos[j]);

                }// ─── CRUD de registros ────────────────────────────────────────────────────────

            }

        }        return JSON.parse(compressed || '[]');



        // Agrupa por descricaoasync function salvarRegistro(tipo) {

        var agrupados = {};

        for (var k = 0; k < filtrados.length; k++) {    const btnGanho    = document.getElementById('btnSalvarGanho');    if (precoPorLitroInput) {    } catch (e) {

            var reg = filtrados[k];

            if (!agrupados[reg.descricao]) {    const btnGasto    = document.getElementById('btnSalvarGasto');

                agrupados[reg.descricao] = { gastos: 0, ganhos: 0, registros: [] };

            }    const descInput   = document.getElementById('descricaoRegistro');        const debouncedSalvar = debounce(salvarPrecoPorLitro, 1000);        console.error('[financeiro.js] Erro ao descomprimir dados:', e);

            if (reg.tipo === 'gasto') agrupados[reg.descricao].gastos += reg.valor;

            else                      agrupados[reg.descricao].ganhos += reg.valor;    const valorInput  = document.getElementById('valorRegistro');

            agrupados[reg.descricao].registros.push(reg);

        }    const idEdicaoInput = document.getElementById('indiceEdicao');        precoPorLitroInput.addEventListener('input', debouncedSalvar);        return [];



        listaEl.innerHTML = '';    const descFeedback  = document.getElementById('descricaoRegistroFeedback');

        var totalGastos = 0;

        var totalGanhos = 0;    const valorFeedback = document.getElementById('valorRegistroFeedback');        precoPorLitroInput.addEventListener('blur',  salvarPrecoPorLitro);    }



        var chaves = Object.keys(agrupados).sort();

        for (var ci = 0; ci < chaves.length; ci++) {

            var desc  = chaves[ci];    if (!descInput || !valorInput || !idEdicaoInput || !descFeedback || !valorFeedback) {    } else {}

            var grupo = agrupados[desc];

            var li    = document.createElement('li');        console.error('[financeiro.js] Elementos de registro não encontrados.');

            li.className = 'list-group-item';

        return;        console.warn('[financeiro.js] #precoPorLitro não encontrado.');

            var html = '<strong>' + desc + '</strong><br>';

            if (grupo.ganhos > 0) html += 'Total de Ganhos: R$ ' + grupo.ganhos.toFixed(2) + '<br>';    }

            if (grupo.gastos > 0) html += 'Total de Gastos: R$ ' + grupo.gastos.toFixed(2) + '<br>';

            html += '<button class="btn btn-danger btn-sm" onclick="removerRegistrosAgrupados(\'' + desc.replace(/'/g, "\\'") + '\')" aria-label="Remover todos">Remover Todos</button>';    }function isIncognito() {

            html += '<ul class="list-group mt-2">';

    if (btnGanho) btnGanho.disabled = true;

            for (var ri = 0; ri < grupo.registros.length; ri++) {

                var r       = grupo.registros[ri];    if (btnGasto) btnGasto.disabled = true;    try {

                var dataFmt = new Date(r.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

                html += '<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="font-size:0.9em;">'

                      + '<span>' + (r.tipo === 'ganho' ? 'Ganho' : 'Gasto') + ': R$ ' + r.valor.toFixed(2) + ' (' + dataFmt + ')</span>'

                      + '<div>'    const descricao  = descInput.value.trim();    if (btnSalvarGanho)    btnSalvarGanho.addEventListener('click', () => salvarRegistro('ganho'));        localStorage.setItem('__test_incognito__', 'test');

                      + '<button class="btn btn-primary btn-sm mr-1" onclick="editarRegistro(' + r.id + ')" aria-label="Editar">&#9998;</button>'

                      + '<button class="btn btn-danger btn-sm"        onclick="removerRegistro(' + r.id + ')" aria-label="Remover">&#215;</button>'    const valor      = parseFloat(valorInput.value);

                      + '</div>'

                      + '</li>';    const idEdicao   = idEdicaoInput.value;   // ID IndexedDB (string) ou ''    if (btnSalvarGasto)    btnSalvarGasto.addEventListener('click', () => salvarRegistro('gasto'));        localStorage.removeItem('__test_incognito__');

            }



            html += '</ul>';

            li.innerHTML = html;    descFeedback.textContent  = '';    if (btnCancelarEdicao) btnCancelarEdicao.addEventListener('click', cancelarEdicao);        return false;

            listaEl.appendChild(li);

    valorFeedback.textContent = '';

            totalGastos += grupo.gastos;

            totalGanhos += grupo.ganhos;    } catch (e) {

        }

    let hasError = false;

        gastosEl.textContent = totalGastos.toFixed(2);

        ganhosEl.textContent = totalGanhos.toFixed(2);    if (!descricao) {    if (semanaConsulta) {        return true;

        saldoEl.textContent  = (totalGanhos - totalGastos).toFixed(2);

        descFeedback.className  = 'form-text text-danger';

    } catch (e) {

        console.error('[financeiro.js] Erro ao carregar registros:', e);        descFeedback.textContent = 'Insira a descrição.';        semanaConsulta.addEventListener('change', carregarRegistros);    }

        listaEl.innerHTML    = '<li class="list-group-item text-danger">Erro ao carregar registros.</li>';

        gastosEl.textContent = '0.00';        hasError = true;

        ganhosEl.textContent = '0.00';

        saldoEl.textContent  = '0.00';    } else if (descricao.length > 50) {    } else {}

    }

}        descFeedback.className  = 'form-text text-danger';



async function atualizarSemanas() {        descFeedback.textContent = 'A descrição deve ter até 50 caracteres.';        console.warn('[financeiro.js] #semanaConsulta não encontrado.');

    var semanaEl = document.getElementById('semanaConsulta');

    if (!semanaEl) return;        hasError = true;



    try {    }    }function showToast(message, type = 'success') {

        var todos   = await MotocaDB.getRegistros();

        var semanas = {};    if (isNaN(valor) || valor <= 0) {

        for (var i = 0; i < todos.length; i++) {

            var d   = new Date(todos[i].data);        valorFeedback.className  = 'form-text text-danger';}    const toast = document.createElement('div');

            var key = d.getUTCFullYear() + '-' + getWeekNumber(d);

            semanas[key] = true;        valorFeedback.textContent = 'Insira um valor válido maior que 0.';

        }

        hasError = true;    toast.className = `toast ${type}`;

        semanaEl.innerHTML = '<option value="">Semana Atual</option>';

        var chaves = Object.keys(semanas).sort().reverse();    }

        for (var ci = 0; ci < chaves.length; ci++) {

            var partes    = chaves[ci].split('-');// ─── configurações (km/litro, preço/litro) ────────────────────────────────────    toast.textContent = message;

            var opt       = document.createElement('option');

            opt.value     = chaves[ci];    if (hasError) {

            opt.textContent = 'Semana ' + partes[1] + ' de ' + partes[0];

            semanaEl.appendChild(opt);        if (btnGanho) btnGanho.disabled = false;    toast.setAttribute('role', 'alert');

        }

    } catch (e) {        if (btnGasto) btnGasto.disabled = false;

        console.error('[financeiro.js] Erro ao atualizar semanas:', e);

        semanaEl.innerHTML = '<option value="">Erro ao carregar semanas</option>';        return;async function carregarConfiguracoes() {    toast.setAttribute('aria-live', 'assertive');

    }

}    }


    const kmPorLitroInput    = document.getElementById('kmPorLitro');    toast.style.position = 'fixed';

    try {

        if (idEdicao !== '') {    const precoPorLitroInput = document.getElementById('precoPorLitro');    toast.style.bottom = '20px';

            // Atualizar registro existente

            await MotocaDB.updateRegistro(parseInt(idEdicao), { tipo, descricao, valor });    toast.style.right = '20px';

            cancelarEdicao();

            showToast('Registro atualizado!', 'success');    if (kmPorLitroInput) {    toast.style.padding = '10px 20px';

            console.log('[financeiro.js] Registro atualizado, id:', idEdicao);

        } else {        const val = await MotocaDB.getConfig('kmPorLitro');    toast.style.background = type === 'success' ? '#28a745' : '#dc3545';

            // Criar novo registro

            const novoId = await MotocaDB.addRegistro({ tipo, descricao, valor, data: new Date().toISOString() });        if (val) kmPorLitroInput.value = val;    toast.style.color = '#fff';

            descInput.value  = '';

            valorInput.value = '';    }    toast.style.borderRadius = '4px';

            descFeedback.className  = 'form-text text-success';

            descFeedback.textContent = `${tipo === 'gasto' ? 'Gasto' : 'Ganho'} registrado com sucesso!`;    toast.style.zIndex = '1000';

            showToast(`${tipo === 'gasto' ? 'Gasto' : 'Ganho'} registrado!`, 'success');

            console.log('[financeiro.js] Novo registro salvo, id:', novoId);    if (precoPorLitroInput) {    toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        }

        await carregarRegistros();        const val = await MotocaDB.getConfig('precoPorLitro');    document.body.appendChild(toast);

    } catch (e) {

        descFeedback.className  = 'form-text text-danger';        if (val) precoPorLitroInput.value = val;    setTimeout(() => toast.remove(), 3000);

        descFeedback.textContent = 'Erro ao salvar registro.';

        showToast('Erro ao salvar registro.', 'error');    }}

        console.error('[financeiro.js] Erro ao salvar registro:', e);

    } finally {}

        if (btnGanho) btnGanho.disabled = false;

        if (btnGasto) btnGasto.disabled = false;function limparDadosAntigos() {

    }

}async function salvarKmPorLitro() {    const now = Date.now();



async function editarRegistro(id) {    const input    = document.getElementById('kmPorLitro');    const expirationMs = STORAGE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

    console.log('[financeiro.js] Tentando editar registro id:', id);

    const feedback = document.getElementById('kmPorLitroFeedback');    let registros = decompressData(localStorage.getItem('registros') || compressData([]));

    const registros = await MotocaDB.getRegistros();

    const registro  = registros.find(r => r.id === id);    if (!input || !feedback) return;



    if (!registro) {    registros = registros.filter(r => now - new Date(r.data).getTime() <= expirationMs);

        showToast('Erro: Registro não encontrado.', 'error');

        console.error('[financeiro.js] Registro não encontrado para id:', id);    const valor = parseFloat(input.value);

        return;

    }    feedback.className   = 'form-text';    try {



    const descInput     = document.getElementById('descricaoRegistro');    feedback.textContent = '';        if (registros.length > MAX_REGISTROS) registros = registros.slice(-MAX_REGISTROS);

    const valorInput    = document.getElementById('valorRegistro');

    const idEdicaoInput = document.getElementById('indiceEdicao');        if (checkStorageAvailability({ registros })) {

    const btnCancelar   = document.getElementById('btnCancelarEdicao');

    const btnGanho      = document.getElementById('btnSalvarGanho');    if (isNaN(valor) || valor <= 0) {            localStorage.setItem('registros', compressData(registros));

    const btnGasto      = document.getElementById('btnSalvarGasto');

    const titulo        = document.getElementById('tituloRegistro');        feedback.className   = 'form-text text-danger';            console.log('[financeiro.js] Dados antigos limpos.');



    if (!descInput || !valorInput || !idEdicaoInput || !btnCancelar || !btnGanho || !btnGasto || !titulo) {        feedback.textContent = 'Insira um valor válido maior que 0.';        } else {

        showToast('Erro: Elementos do formulário não encontrados.', 'error');

        return;        input.classList.remove('saved');            throw new Error('Espaço insuficiente no localStorage.');

    }

        return;        }

    descInput.value     = registro.descricao || '';

    valorInput.value    = registro.valor ? registro.valor.toFixed(2) : '';    }    } catch (e) {

    idEdicaoInput.value = id.toString();

    btnCancelar.style.display = 'inline-block';        console.error('[financeiro.js] Erro ao limpar dados antigos:', e);

    btnGanho.textContent = registro.tipo === 'ganho' ? 'Salvar Alterações' : 'Adicionar Ganho';

    btnGasto.textContent = registro.tipo === 'gasto' ? 'Salvar Alterações' : 'Adicionar Gasto';    if (valor > 100) {        showToast('Erro ao limpar dados antigos. Considere limpar os dados financeiros manualmente.', 'error');

    titulo.textContent   = 'Editar Registro';

    console.log('[financeiro.js] Registro carregado para edição:', registro);        feedback.className   = 'form-text text-warning';    }

}

        feedback.textContent = 'Valor alto detectado. Confirme se está correto.';}

function cancelarEdicao() {

    const descInput     = document.getElementById('descricaoRegistro');    }

    const valorInput    = document.getElementById('valorRegistro');

    const idEdicaoInput = document.getElementById('indiceEdicao');function getWeekNumber(d) {

    const btnCancelar   = document.getElementById('btnCancelarEdicao');

    const btnGanho      = document.getElementById('btnSalvarGanho');    try {    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

    const btnGasto      = document.getElementById('btnSalvarGasto');

    const descFeedback  = document.getElementById('descricaoRegistroFeedback');        await MotocaDB.setConfig('kmPorLitro', valor);    const day = (d.getUTCDay() + 6) % 7;

    const valorFeedback = document.getElementById('valorRegistroFeedback');

    const titulo        = document.getElementById('tituloRegistro');        feedback.className   = 'form-text text-success';    d.setUTCDate(d.getUTCDate() - day + 3);



    if (descInput)     descInput.value     = '';        feedback.textContent = 'Consumo salvo!';    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    if (valorInput)    valorInput.value    = '';

    if (idEdicaoInput) idEdicaoInput.value = '';        input.classList.add('saved');    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

    if (btnCancelar)   btnCancelar.style.display = 'none';

    if (btnGanho)      btnGanho.textContent = 'Adicionar Ganho';        showToast('Consumo salvo!', 'success');    return weekNo;

    if (btnGasto)      btnGasto.textContent = 'Adicionar Gasto';

    if (descFeedback)  descFeedback.textContent  = '';    } catch (e) {}

    if (valorFeedback) valorFeedback.textContent = '';

    if (titulo)        titulo.textContent   = 'Adicionar Registro';        feedback.className   = 'form-text text-danger';

    console.log('[financeiro.js] Edição cancelada.');

}        feedback.textContent = 'Erro ao salvar consumo.';document.addEventListener('DOMContentLoaded', () => {



async function removerRegistro(id) {        input.classList.remove('saved');    console.log('[financeiro.js] DOM carregado. Configurando aba Financeiro...');

    if (!confirm('Deseja remover este registro?')) return;

        showToast('Erro ao salvar consumo.', 'error');

    try {

        await MotocaDB.deleteRegistro(id);        console.error('[financeiro.js] Erro ao salvar kmPorLitro:', e);    if (isIncognito()) {

        showToast('Registro removido!', 'success');

        console.log('[financeiro.js] Registro removido, id:', id);    }        showToast('Modo anônimo detectado. O salvamento pode não funcionar corretamente.', 'error');

        await carregarRegistros();

    } catch (e) {}        console.warn('[financeiro.js] Modo anônimo detectado.');

        showToast('Erro ao remover registro.', 'error');

        console.error('[financeiro.js] Erro ao remover registro:', e);    }

    }

}async function salvarPrecoPorLitro() {



async function removerRegistrosAgrupados(descricao) {    const input    = document.getElementById('precoPorLitro');    try {

    if (!confirm(`Deseja remover todos os registros com a descrição "${descricao}"?`)) return;

    const feedback = document.getElementById('precoPorLitroFeedback');        let registros = decompressData(localStorage.getItem('registros') || compressData([]));

    try {

        await MotocaDB.deleteRegistrosByDescricao(descricao);    if (!input || !feedback) return;        if (registros.length > MAX_REGISTROS) {

        showToast('Registros removidos!', 'success');

        console.log('[financeiro.js] Registros removidos por descrição:', descricao);            limparDadosAntigos();

        await carregarRegistros();

    } catch (e) {    const valor = parseFloat(input.value);        }

        showToast('Erro ao remover registros.', 'error');

        console.error('[financeiro.js] Erro ao remover registros agrupados:', e);    feedback.className   = 'form-text';    } catch (e) {

    }

}    feedback.textContent = '';        console.error('[financeiro.js] Erro na verificação inicial de dados:', e);



// ─── exibição de registros ────────────────────────────────────────────────────    }



async function carregarRegistros() {    if (isNaN(valor) || valor <= 0) {

    const listaEl   = document.getElementById('listaRegistros');

    const gastosEl  = document.getElementById('totalGastos');        feedback.className   = 'form-text text-danger';    limparDadosAntigos();

    const ganhosEl  = document.getElementById('totalGanhos');

    const saldoEl   = document.getElementById('saldoTotal');        feedback.textContent = 'Insira um valor válido maior que 0.';    carregarConfiguracoes();

    const semanaEl  = document.getElementById('semanaConsulta');

        input.classList.remove('saved');    carregarRegistros();

    if (!listaEl || !gastosEl || !ganhosEl || !saldoEl || !semanaEl) {

        console.error('[financeiro.js] Elementos de lista não encontrados.');        return;    configurarEventos();

        return;

    }    }    atualizarSemanas();



    try {});

        const todos = await MotocaDB.getRegistros();

        const semanaSel = semanaEl.value;    if (valor > 50) {



        // Filtra por semana selecionada ou semana atual        feedback.className   = 'form-text text-warning';function configurarEventos() {

        let filtrados;

        if (semanaSel) {        feedback.textContent = 'Preço alto detectado. Confirme se está correto.';    console.log('[financeiro.js] Configurando eventos...');

            const [ano, semana] = semanaSel.split('-').map(Number);

            filtrados = todos.filter(r => {    }

                const d = new Date(r.data);

                return d.getUTCFullYear() === ano && getWeekNumber(d) === semana;    const kmPorLitroInput = document.getElementById('kmPorLitro');

            });

        } else {    try {    const precoPorLitroInput = document.getElementById('precoPorLitro');

            const hoje    = new Date();

            const anoAtual    = hoje.getUTCFullYear();        await MotocaDB.setConfig('precoPorLitro', valor);    const semanaConsulta = document.getElementById('semanaConsulta');

            const semanaAtual = getWeekNumber(hoje);

            filtrados = todos.filter(r => {        feedback.className   = 'form-text text-success';

                const d = new Date(r.data);

                return d.getUTCFullYear() === anoAtual && getWeekNumber(d) === semanaAtual;        feedback.textContent = 'Preço salvo!';    const debouncedSalvarKmPorLitro = debounce(salvarKmPorLitro, 1000);

            });

        }        input.classList.add('saved');    const debouncedSalvarPrecoPorLitro = debounce(salvarPrecoPorLitro, 1000);



        // Agrupa por descrição        showToast('Preço salvo!', 'success');

        const agrupados = {};

        filtrados.forEach(r => {    } catch (e) {    if (kmPorLitroInput) {

            if (!agrupados[r.descricao]) agrupados[r.descricao] = { gastos: 0, ganhos: 0, registros: [] };

            if (r.tipo === 'gasto') agrupados[r.descricao].gastos += r.valor;        feedback.className   = 'form-text text-danger';        kmPorLitroInput.addEventListener('input', debouncedSalvarKmPorLitro);

            else                    agrupados[r.descricao].ganhos += r.valor;

            agrupados[r.descricao].registros.push(r);        feedback.textContent = 'Erro ao salvar preço.';        kmPorLitroInput.addEventListener('blur', salvarKmPorLitro);

        });

        input.classList.remove('saved');    } else {

        listaEl.innerHTML = '';

        let totalGastosVal = 0;        showToast('Erro ao salvar preço.', 'error');        console.warn('[financeiro.js] Input #kmPorLitro não encontrado.');

        let totalGanhosVal = 0;

        console.error('[financeiro.js] Erro ao salvar precoPorLitro:', e);    }

        Object.keys(agrupados).sort().forEach(descricao => {

            const grupo = agrupados[descricao];    }

            const li    = document.createElement('li');

            li.className = 'list-group-item';}    if (precoPorLitroInput) {



            let html = `<strong>${descricao}</strong><br>`;        precoPorLitroInput.addEventListener('input', debouncedSalvarPrecoPorLitro);

            if (grupo.ganhos > 0) html += `Total de Ganhos: R$ ${grupo.ganhos.toFixed(2)}<br>`;

            if (grupo.gastos > 0) html += `Total de Gastos: R$ ${grupo.gastos.toFixed(2)}<br>`;// ─── CRUD de registros ────────────────────────────────────────────────────────        precoPorLitroInput.addEventListener('blur', salvarPrecoPorLitro);

            html += `<button class="btn btn-danger btn-sm" onclick="removerRegistrosAgrupados('${descricao}')" aria-label="Remover todos os registros com descrição ${descricao}">Remover Todos</button>`;

            html += `<ul class="list-group mt-2">`;    } else {



            grupo.registros.forEach(reg => {async function salvarRegistro(tipo) {        console.warn('[financeiro.js] Input #precoPorLitro não encontrado.');

                const dataFmt = new Date(reg.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

                html += `    const btnSalvarGanho    = document.getElementById('btnSalvarGanho');    }

                    <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="font-size:0.9em;">

                        <span>${reg.tipo === 'ganho' ? 'Ganho' : 'Gasto'}: R$ ${reg.valor.toFixed(2)} (${dataFmt})</span>    const btnSalvarGasto    = document.getElementById('btnSalvarGasto');

                        <div>

                            <button class="btn btn-primary btn-sm mr-1" onclick="editarRegistro(${reg.id})" aria-label="Editar registro">✏️</button>    const descricaoInput    = document.getElementById('descricaoRegistro');    const btnSalvarGanho = document.getElementById('btnSalvarGanho');

                            <button class="btn btn-danger btn-sm"        onclick="removerRegistro(${reg.id})" aria-label="Remover registro">×</button>

                        </div>    const valorInput        = document.getElementById('valorRegistro');    const btnSalvarGasto = document.getElementById('btnSalvarGasto');

                    </li>`;

            });    const idEdicaoInput     = document.getElementById('indiceEdicao');    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');



            html += `</ul>`;    const descricaoFeedback = document.getElementById('descricaoRegistroFeedback');    if (btnSalvarGanho) {

            li.innerHTML = html;

            listaEl.appendChild(li);    const valorFeedback     = document.getElementById('valorRegistroFeedback');        btnSalvarGanho.addEventListener('click', () => salvarRegistro('ganho'));



            totalGastosVal += grupo.gastos;    } else {

            totalGanhosVal += grupo.ganhos;

        });    if (!descricaoInput || !valorInput || !idEdicaoInput || !descricaoFeedback || !valorFeedback) {        console.warn('[financeiro.js] Botão #btnSalvarGanho não encontrado.');



        gastosEl.textContent = totalGastosVal.toFixed(2);        console.error('[financeiro.js] Elementos de registro não encontrados.');    }

        ganhosEl.textContent = totalGanhosVal.toFixed(2);

        saldoEl.textContent  = (totalGanhosVal - totalGastosVal).toFixed(2);        return;



        console.log('[financeiro.js] Registros carregados:', filtrados.length,    }    if (btnSalvarGasto) {

            '| Gastos: R$', totalGastosVal.toFixed(2),

            '| Ganhos: R$', totalGanhosVal.toFixed(2));        btnSalvarGasto.addEventListener('click', () => salvarRegistro('gasto'));

    } catch (e) {

        console.error('[financeiro.js] Erro ao carregar registros:', e);    if (btnSalvarGanho) btnSalvarGanho.disabled = true;    } else {

        listaEl.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar registros.</li>';

        gastosEl.textContent = '0.00';    if (btnSalvarGasto) btnSalvarGasto.disabled = true;        console.warn('[financeiro.js] Botão #btnSalvarGasto não encontrado.');

        ganhosEl.textContent = '0.00';

        saldoEl.textContent  = '0.00';    }

    }

}    const descricao = descricaoInput.value.trim();



async function atualizarSemanas() {    const valor     = parseFloat(valorInput.value);    if (btnCancelarEdicao) {

    const semanaEl = document.getElementById('semanaConsulta');

    if (!semanaEl) {    const idEdicao  = idEdicaoInput.value;        btnCancelarEdicao.addEventListener('click', cancelarEdicao);

        console.warn('[financeiro.js] Select #semanaConsulta não encontrado.');

        return;    } else {

    }

    descricaoFeedback.textContent = '';        console.warn('[financeiro.js] Botão #btnCancelarEdicao não encontrado.');

    try {

        const todos   = await MotocaDB.getRegistros();    valorFeedback.textContent     = '';    }

        const semanas = new Set();



        todos.forEach(r => {

            const d = new Date(r.data);    let hasError = false;    if (semanaConsulta) {

            semanas.add(`${d.getUTCFullYear()}-${getWeekNumber(d)}`);

        });        semanaConsulta.addEventListener('change', carregarRegistros);



        semanaEl.innerHTML = '<option value="">Semana Atual</option>';    if (!descricao) {    } else {

        Array.from(semanas).sort().reverse().forEach(s => {

            const [ano, semanaNum] = s.split('-').map(Number);        descricaoFeedback.className   = 'form-text text-danger';        console.warn('[financeiro.js] Select #semanaConsulta não encontrado.');

            const opt = document.createElement('option');

            opt.value       = s;        descricaoFeedback.textContent = 'Insira a descrição.';    }

            opt.textContent = `Semana ${semanaNum} de ${ano}`;

            semanaEl.appendChild(opt);        hasError = true;}

        });

    } else if (descricao.length > 50) {

        console.log('[financeiro.js] Semanas atualizadas:', semanas.size);

    } catch (e) {        descricaoFeedback.className   = 'form-text text-danger';function carregarConfiguracoes() {

        console.error('[financeiro.js] Erro ao atualizar semanas:', e);

        semanaEl.innerHTML = '<option value="">Erro ao carregar semanas</option>';        descricaoFeedback.textContent = 'A descrição deve ter até 50 caracteres.';    const kmPorLitroInput = document.getElementById('kmPorLitro');

    }

}        hasError = true;    const precoPorLitroInput = document.getElementById('precoPorLitro');


    }    

    if (kmPorLitroInput) {

    if (isNaN(valor) || valor <= 0) {        const savedKmPorLitro = localStorage.getItem('kmPorLitro');

        valorFeedback.className   = 'form-text text-danger';        if (savedKmPorLitro) kmPorLitroInput.value = savedKmPorLitro;

        valorFeedback.textContent = 'Insira um valor válido maior que 0.';    } else {

        hasError = true;        console.warn('[financeiro.js] Input #kmPorLitro não encontrado.');

    }    }



    if (hasError) {    if (precoPorLitroInput) {

        if (btnSalvarGanho) btnSalvarGanho.disabled = false;        const savedPrecoPorLitro = localStorage.getItem('precoPorLitro');

        if (btnSalvarGasto) btnSalvarGasto.disabled = false;        if (savedPrecoPorLitro) precoPorLitroInput.value = savedPrecoPorLitro;

        return;    } else {

    }        console.warn('[financeiro.js] Input #precoPorLitro não encontrado.');

    }

    try {}

        if (idEdicao !== '') {

            // Edição — mantém data originalfunction salvarKmPorLitro() {

            const id        = parseInt(idEdicao, 10);    const kmPorLitroInput = document.getElementById('kmPorLitro');

            const registros = await MotocaDB.getRegistros();    const feedback = document.getElementById('kmPorLitroFeedback');

            const original  = registros.find(r => r.id === id);    

            if (!original) throw new Error('Registro não encontrado para edição.');    if (!kmPorLitroInput || !feedback) {

        console.error('[financeiro.js] Elementos #kmPorLitro ou #kmPorLitroFeedback não encontrados.');

            await MotocaDB.updateRegistro({ ...original, tipo, descricao, valor });        return;

            cancelarEdicao();    }

            showToast('Registro atualizado!', 'success');

        } else {    const kmPorLitro = parseFloat(kmPorLitroInput.value);

            // Novo    feedback.className = 'form-text';

            await MotocaDB.addRegistro({    feedback.textContent = '';

                tipo,

                descricao,    if (isNaN(kmPorLitro) || kmPorLitro <= 0) {

                valor,        feedback.className = 'form-text text-danger';

                data: new Date().toISOString()        feedback.textContent = 'Insira um valor válido maior que 0.';

            });        kmPorLitroInput.classList.remove('saved');

            showToast(`${tipo === 'gasto' ? 'Gasto' : 'Ganho'} registrado!`, 'success');        return;

        }    }



        descricaoInput.value          = '';    if (kmPorLitro > 100) {

        valorInput.value              = '';        feedback.className = 'form-text text-warning';

        descricaoFeedback.className   = 'form-text text-success';        feedback.textContent = 'Valor alto detectado. Confirme se está correto.';

        descricaoFeedback.textContent = idEdicao !== '' ? 'Registro atualizado!' : 'Registro salvo!';    }



        await carregarRegistros();    try {

        await atualizarSemanas();        limparDadosAntigos();

        if (checkStorageAvailability({ kmPorLitro })) {

    } catch (e) {            localStorage.setItem('kmPorLitro', kmPorLitro.toString());

        descricaoFeedback.className   = 'form-text text-danger';            feedback.className = 'form-text text-success';

        descricaoFeedback.textContent = 'Erro ao salvar registro.';            feedback.textContent = 'Consumo salvo com sucesso!';

        showToast('Erro ao salvar registro.', 'error');            kmPorLitroInput.classList.add('saved');

        console.error('[financeiro.js] Erro ao salvar registro:', e);            showToast('Consumo salvo!', 'success');

    } finally {            console.log('[financeiro.js] Km por litro salvo:', kmPorLitro);

        if (btnSalvarGanho) btnSalvarGanho.disabled = false;        } else {

        if (btnSalvarGasto) btnSalvarGasto.disabled = false;            throw new Error('Espaço insuficiente no localStorage.');

    }        }

}    } catch (e) {

        feedback.className = 'form-text text-danger';

async function editarRegistro(id) {        feedback.textContent = 'Erro ao salvar consumo. O armazenamento está cheio. Considere limpar os dados financeiros.';

    const registros = await MotocaDB.getRegistros();        kmPorLitroInput.classList.remove('saved');

    const registro  = registros.find(r => r.id === id);        showToast('Erro ao salvar consumo. Armazenamento cheio.', 'error');

        console.error('[financeiro.js] Erro ao salvar kmPorLitro:', e);

    if (!registro) {    }

        showToast('Erro: Registro não encontrado.', 'error');}

        return;

    }function salvarPrecoPorLitro() {

    const precoPorLitroInput = document.getElementById('precoPorLitro');

    const descricaoInput    = document.getElementById('descricaoRegistro');    const feedback = document.getElementById('precoPorLitroFeedback');

    const valorInput        = document.getElementById('valorRegistro');    

    const idEdicaoInput     = document.getElementById('indiceEdicao');    if (!precoPorLitroInput || !feedback) {

    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');        console.error('[financeiro.js] Elementos #precoPorLitro ou #precoPorLitroFeedback não encontrados.');

    const btnSalvarGanho    = document.getElementById('btnSalvarGanho');        return;

    const btnSalvarGasto    = document.getElementById('btnSalvarGasto');    }

    const tituloRegistro    = document.getElementById('tituloRegistro');

    const precoPorLitro = parseFloat(precoPorLitroInput.value);

    if (!descricaoInput || !valorInput || !idEdicaoInput) {    feedback.className = 'form-text';

        showToast('Erro: Formulário não encontrado.', 'error');    feedback.textContent = '';

        return;

    }    if (isNaN(precoPorLitro) || precoPorLitro <= 0) {

        feedback.className = 'form-text text-danger';

    descricaoInput.value = registro.descricao || '';        feedback.textContent = 'Insira um valor válido maior que 0.';

    valorInput.value     = registro.valor ? registro.valor.toFixed(2) : '';        precoPorLitroInput.classList.remove('saved');

    idEdicaoInput.value  = String(id);        return;

    }

    if (btnCancelarEdicao) btnCancelarEdicao.style.display = 'inline-block';

    if (btnSalvarGanho)    btnSalvarGanho.textContent = registro.tipo === 'ganho' ? 'Salvar Alterações' : 'Adicionar Ganho';    if (precoPorLitro > 50) {

    if (btnSalvarGasto)    btnSalvarGasto.textContent = registro.tipo === 'gasto' ? 'Salvar Alterações' : 'Adicionar Gasto';        feedback.className = 'form-text text-warning';

    if (tituloRegistro)    tituloRegistro.textContent = 'Editar Registro';        feedback.textContent = 'Preço alto detectado. Confirme se está correto.';

    }

    descricaoInput.focus();

}    try {

        limparDadosAntigos();

function cancelarEdicao() {        if (checkStorageAvailability({ precoPorLitro })) {

    const descricaoInput    = document.getElementById('descricaoRegistro');            localStorage.setItem('precoPorLitro', precoPorLitro.toString());

    const valorInput        = document.getElementById('valorRegistro');            feedback.className = 'form-text text-success';

    const idEdicaoInput     = document.getElementById('indiceEdicao');            feedback.textContent = 'Preço salvo com sucesso!';

    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');            precoPorLitroInput.classList.add('saved');

    const btnSalvarGanho    = document.getElementById('btnSalvarGanho');            showToast('Preço salvo!', 'success');

    const btnSalvarGasto    = document.getElementById('btnSalvarGasto');            console.log('[financeiro.js] Preço por litro salvo:', precoPorLitro);

    const descricaoFeedback = document.getElementById('descricaoRegistroFeedback');        } else {

    const valorFeedback     = document.getElementById('valorRegistroFeedback');            throw new Error('Espaço insuficiente no localStorage.');

    const tituloRegistro    = document.getElementById('tituloRegistro');        }

    } catch (e) {

    if (descricaoInput)    descricaoInput.value    = '';        feedback.className = 'form-text text-danger';

    if (valorInput)        valorInput.value        = '';        feedback.textContent = 'Erro ao salvar preço. O armazenamento está cheio. Considere limpar os dados financeiros.';

    if (idEdicaoInput)     idEdicaoInput.value     = '';        precoPorLitroInput.classList.remove('saved');

    if (btnCancelarEdicao) btnCancelarEdicao.style.display = 'none';        showToast('Erro ao salvar preço. Armazenamento cheio.', 'error');

    if (btnSalvarGanho)    btnSalvarGanho.textContent = 'Adicionar Ganho';        console.error('[financeiro.js] Erro ao salvar precoPorLitro:', e);

    if (btnSalvarGasto)    btnSalvarGasto.textContent = 'Adicionar Gasto';    }

    if (descricaoFeedback) descricaoFeedback.textContent = '';}

    if (valorFeedback)     valorFeedback.textContent     = '';

    if (tituloRegistro)    tituloRegistro.textContent    = 'Adicionar Registro';function salvarRegistro(tipo) {

}    const btnSalvarGanho = document.getElementById('btnSalvarGanho');

    const btnSalvarGasto = document.getElementById('btnSalvarGasto');

async function removerRegistro(id) {    const descricaoInput = document.getElementById('descricaoRegistro');

    if (!confirm('Deseja remover este registro?')) return;    const valorInput = document.getElementById('valorRegistro');

    try {    const indiceEdicaoInput = document.getElementById('indiceEdicao');

        await MotocaDB.deleteRegistro(id);    const descricaoFeedback = document.getElementById('descricaoRegistroFeedback');

        showToast('Registro removido!', 'success');    const valorFeedback = document.getElementById('valorRegistroFeedback');

        await carregarRegistros();

        await atualizarSemanas();    if (!descricaoInput || !valorInput || !indiceEdicaoInput || !descricaoFeedback || !valorFeedback) {

    } catch (e) {        console.error('[financeiro.js] Elementos de registro não encontrados.');

        showToast('Erro ao remover registro.', 'error');        return;

        console.error('[financeiro.js] Erro ao remover registro:', e);    }

    }

}    if (btnSalvarGanho) btnSalvarGanho.disabled = true;

    if (btnSalvarGasto) btnSalvarGasto.disabled = true;

async function removerRegistrosAgrupados(descricao) {

    if (!confirm(`Deseja remover todos os registros com a descrição "${descricao}"?`)) return;    const descricao = descricaoInput.value.trim();

    try {    const valor = parseFloat(valorInput.value);

        const total = await MotocaDB.deleteRegistrosByDescricao(descricao);    const indiceEdicao = indiceEdicaoInput.value;

        showToast(`${total} registro(s) removido(s)!`, 'success');

        await carregarRegistros();    descricaoFeedback.textContent = '';

        await atualizarSemanas();    valorFeedback.textContent = '';

    } catch (e) {

        showToast('Erro ao remover registros.', 'error');    let hasError = false;

        console.error('[financeiro.js] Erro ao remover registros agrupados:', e);    if (!descricao) {

    }        descricaoFeedback.className = 'form-text text-danger';

}        descricaoFeedback.textContent = 'Insira a descrição.';

        hasError = true;

// ─── renderização da lista ────────────────────────────────────────────────────    } else if (descricao.length > 50) {

        descricaoFeedback.className = 'form-text text-danger';

async function carregarRegistros() {        descricaoFeedback.textContent = 'A descrição deve ter até 50 caracteres.';

    const listaRegistros = document.getElementById('listaRegistros');        hasError = true;

    const totalGastosEl  = document.getElementById('totalGastos');    }

    const totalGanhosEl  = document.getElementById('totalGanhos');    if (isNaN(valor) || valor <= 0) {

    const saldoTotalEl   = document.getElementById('saldoTotal');        valorFeedback.className = 'form-text text-danger';

    const semanaConsulta = document.getElementById('semanaConsulta');        valorFeedback.textContent = 'Insira um valor válido maior que 0.';

        hasError = true;

    if (!listaRegistros || !totalGastosEl || !totalGanhosEl || !saldoTotalEl || !semanaConsulta) {    }

        console.error('[financeiro.js] Elementos da listagem não encontrados.');

        return;    if (hasError) {

    }        if (btnSalvarGanho) btnSalvarGanho.disabled = false;

        if (btnSalvarGasto) btnSalvarGasto.disabled = false;

    try {        return;

        const todos             = await MotocaDB.getRegistros();    }

        const semanaSelecionada = semanaConsulta.value;

    try {

        // Filtrar por semana        limparDadosAntigos();

        let filtrados;        let registros = decompressData(localStorage.getItem('registros') || compressData([]));

        if (semanaSelecionada) {        

            const [ano, semana] = semanaSelecionada.split('-').map(Number);        if (indiceEdicao !== '') {

            filtrados = todos.filter(r => {            const indice = parseInt(indiceEdicao);

                const d = new Date(r.data);            if (indice >= 0 && indice < registros.length) {

                return d.getUTCFullYear() === ano && getWeekNumber(d) === semana;                registros[indice] = {

            });                    tipo,

        } else {                    descricao,

            const hoje        = new Date();                    valor,

            const anoAtual    = hoje.getUTCFullYear();                    data: registros[indice].data

            const semanaAtual = getWeekNumber(hoje);                };

            filtrados = todos.filter(r => {                cancelarEdicao();

                const d = new Date(r.data);                showToast('Registro atualizado!', 'success');

                return d.getUTCFullYear() === anoAtual && getWeekNumber(d) === semanaAtual;                console.log('[financeiro.js] Registro atualizado:', registros[indice]);

            });            } else {

        }                throw new Error('Índice de edição inválido.');

            }

        // Agrupar por descrição        } else {

        const agrupados = {};            const novoRegistro = {

        for (const reg of filtrados) {                tipo,

            if (!agrupados[reg.descricao]) {                descricao,

                agrupados[reg.descricao] = { gastos: 0, ganhos: 0, registros: [] };                valor,

            }                data: new Date().toISOString()

            if (reg.tipo === 'gasto') agrupados[reg.descricao].gastos += reg.valor;            };

            else                      agrupados[reg.descricao].ganhos += reg.valor;            registros.push(novoRegistro);

            agrupados[reg.descricao].registros.push(reg);            console.log('[financeiro.js] Novo registro salvo:', novoRegistro);

        }        }



        listaRegistros.innerHTML = '';        if (registros.length > MAX_REGISTROS) registros = registros.slice(-MAX_REGISTROS);

        let totalGastos = 0;        if (checkStorageAvailability({ registros })) {

        let totalGanhos = 0;            localStorage.setItem('registros', compressData(registros));

            descricaoInput.value = '';

        for (const descricao of Object.keys(agrupados).sort()) {            valorInput.value = '';

            const grupo = agrupados[descricao];            descricaoFeedback.className = 'form-text text-success';

            const li    = document.createElement('li');            descricaoFeedback.textContent = indiceEdicao !== '' ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!';

            li.className = 'list-group-item';            showToast(indiceEdicao !== '' ? 'Registro atualizado!' : `${tipo === 'gasto' ? 'Gasto' : 'Ganho'} registrado!`, 'success');

            carregarRegistros();

            let html = `<strong>${descricao}</strong><br>`;        } else {

            if (grupo.ganhos > 0) html += `Total de Ganhos: R$ ${grupo.ganhos.toFixed(2)}<br>`;            throw new Error('Espaço insuficiente no localStorage.');

            if (grupo.gastos > 0) html += `Total de Gastos: R$ ${grupo.gastos.toFixed(2)}<br>`;        }

            html += `<button class="btn btn-danger btn-sm"    } catch (e) {

                         onclick="removerRegistrosAgrupados('${descricao.replace(/'/g, "\\'")}')"        descricaoFeedback.className = 'form-text text-danger';

                         aria-label="Remover todos os registros com descrição ${descricao}">        descricaoFeedback.textContent = 'Erro ao salvar registro. O armazenamento está cheio. Considere limpar os dados financeiros.';

                       Remover Todos        showToast('Erro ao salvar registro. Armazenamento cheio.', 'error');

                     </button>        console.error('[financeiro.js] Erro ao salvar registro:', e);

                     <ul class="list-group mt-2">`;    } finally {

        if (btnSalvarGanho) btnSalvarGanho.disabled = false;

            for (const reg of grupo.registros) {        if (btnSalvarGasto) btnSalvarGasto.disabled = false;

                const dataFormatada = new Date(reg.data).toLocaleString('pt-BR', {    }

                    dateStyle: 'short',}

                    timeStyle: 'short'

                });function editarRegistro(indice) {

                html += `    console.log('[financeiro.js] Tentando editar registro com índice:', indice);

                    <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="font-size:.9em">    const registros = decompressData(localStorage.getItem('registros') || compressData([]));

                        <span>${reg.tipo === 'ganho' ? 'Ganho' : 'Gasto'}: R$ ${reg.valor.toFixed(2)} (${dataFormatada})</span>    

                        <div>    if (indice < 0 || indice >= registros.length || !registros[indice]) {

                            <button class="btn btn-primary btn-sm mr-1"        showToast('Erro: Registro não encontrado.', 'error');

                                    onclick="editarRegistro(${reg.id})"        console.error('[financeiro.js] Índice de edição inválido ou registro não existe:', indice, 'Total de registros:', registros.length);

                                    aria-label="Editar registro">✏️</button>        return;

                            <button class="btn btn-danger btn-sm"    }

                                    onclick="removerRegistro(${reg.id})"

                                    aria-label="Remover registro">×</button>    const registro = registros[indice];

                        </div>    const descricaoInput = document.getElementById('descricaoRegistro');

                    </li>`;    const valorInput = document.getElementById('valorRegistro');

            }    const indiceEdicaoInput = document.getElementById('indiceEdicao');

            html += `</ul>`;    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

            li.innerHTML = html;    const btnSalvarGanho = document.getElementById('btnSalvarGanho');

            listaRegistros.appendChild(li);    const btnSalvarGasto = document.getElementById('btnSalvarGasto');

    const tituloRegistro = document.getElementById('tituloRegistro');

            totalGastos += grupo.gastos;

            totalGanhos += grupo.ganhos;    if (!descricaoInput || !valorInput || !indiceEdicaoInput || !btnCancelarEdicao || !btnSalvarGanho || !btnSalvarGasto || !tituloRegistro) {

        }        showToast('Erro: Elementos do formulário não encontrados.', 'error');

        console.error('[financeiro.js] Elementos do formulário não encontrados.');

        if (filtrados.length === 0) {        return;

            listaRegistros.innerHTML = '<li class="list-group-item text-muted">Nenhum registro neste período.</li>';    }

        }

    try {

        totalGastosEl.textContent = totalGastos.toFixed(2);        descricaoInput.value = registro.descricao || '';

        totalGanhosEl.textContent = totalGanhos.toFixed(2);        valorInput.value = registro.valor ? registro.valor.toFixed(2) : '';

        saldoTotalEl.textContent  = (totalGanhos - totalGastos).toFixed(2);        indiceEdicaoInput.value = indice.toString();

        btnCancelarEdicao.style.display = 'inline-block';

    } catch (e) {        btnSalvarGanho.textContent = registro.tipo === 'ganho' ? 'Salvar Alterações' : 'Adicionar Ganho';

        console.error('[financeiro.js] Erro ao carregar registros:', e);        btnSalvarGasto.textContent = registro.tipo === 'gasto' ? 'Salvar Alterações' : 'Adicionar Gasto';

        listaRegistros.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar registros.</li>';        tituloRegistro.textContent = 'Editar Registro';

        totalGastosEl.textContent = '0.00';        console.log('[financeiro.js] Registro carregado para edição:', registro);

        totalGanhosEl.textContent = '0.00';    } catch (e) {

        saldoTotalEl.textContent  = '0.00';        showToast('Erro ao carregar registro para edição.', 'error');

    }        console.error('[financeiro.js] Erro ao preparar edição:', e);

}    }

}

async function atualizarSemanas() {

    const semanaConsulta = document.getElementById('semanaConsulta');function cancelarEdicao() {

    if (!semanaConsulta) return;    const descricaoInput = document.getElementById('descricaoRegistro');

    const valorInput = document.getElementById('valorRegistro');

    try {    const indiceEdicaoInput = document.getElementById('indiceEdicao');

        const todos   = await MotocaDB.getRegistros();    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

        const semanas = new Set();    const btnSalvarGanho = document.getElementById('btnSalvarGanho');

    const btnSalvarGasto = document.getElementById('btnSalvarGasto');

        for (const r of todos) {    const descricaoFeedback = document.getElementById('descricaoRegistroFeedback');

            const d   = new Date(r.data);    const valorFeedback = document.getElementById('valorRegistroFeedback');

            const ano = d.getUTCFullYear();    const tituloRegistro = document.getElementById('tituloRegistro');

            const sem = getWeekNumber(d);

            semanas.add(`${ano}-${sem}`);    if (!descricaoInput || !valorInput || !indiceEdicaoInput || !btnCancelarEdicao || !btnSalvarGanho || !btnSalvarGasto || !descricaoFeedback || !valorFeedback || !tituloRegistro) {

        }        console.error('[financeiro.js] Elementos do formulário não encontrados.');

        return;

        const selecionada = semanaConsulta.value;    }

        semanaConsulta.innerHTML = '<option value="">Semana Atual</option>';

    descricaoInput.value = '';

        Array.from(semanas).sort().reverse().forEach(semana => {    valorInput.value = '';

            const [ano, semanaNum] = semana.split('-').map(Number);    indiceEdicaoInput.value = '';

            const opt = document.createElement('option');    btnCancelarEdicao.style.display = 'none';

            opt.value       = semana;    btnSalvarGanho.textContent = 'Adicionar Ganho';

            opt.textContent = `Semana ${semanaNum} de ${ano}`;    btnSalvarGasto.textContent = 'Adicionar Gasto';

            if (semana === selecionada) opt.selected = true;    descricaoFeedback.textContent = '';

            semanaConsulta.appendChild(opt);    valorFeedback.textContent = '';

        });    tituloRegistro.textContent = 'Adicionar Registro';

    console.log('[financeiro.js] Edição cancelada.');

    } catch (e) {}

        console.error('[financeiro.js] Erro ao atualizar semanas:', e);

        semanaConsulta.innerHTML = '<option value="">Erro ao carregar semanas</option>';function removerRegistro(indice) {

    }    if (!confirm('Deseja remover este registro?')) return;

}

    try {
        let registros = decompressData(localStorage.getItem('registros') || compressData([]));
        if (indice < 0 || indice >= registros.length) {
            throw new Error('Índice inválido.');
        }
        registros.splice(indice, 1);
        if (checkStorageAvailability({ registros })) {
            localStorage.setItem('registros', compressData(registros));
            showToast('Registro removido!', 'success');
            console.log('[financeiro.js] Registro removido, índice:', indice);
            carregarRegistros();
        } else {
            throw new Error('Espaço insuficiente no localStorage.');
        }
    } catch (e) {
        showToast('Erro ao remover registro. Armazenamento cheio.', 'error');
        console.error('[financeiro.js] Erro ao remover registro:', e);
    }
}

function carregarRegistros() {
    const listaRegistros = document.getElementById('listaRegistros');
    const totalGastos = document.getElementById('totalGastos');
    const totalGanhos = document.getElementById('totalGanhos');
    const saldoTotal = document.getElementById('saldoTotal');
    const semanaConsulta = document.getElementById('semanaConsulta');

    if (!listaRegistros || !totalGastos || !totalGanhos || !saldoTotal || !semanaConsulta) {
        console.error('[financeiro.js] Elementos #listaRegistros, #totalGastos, #totalGanhos, #saldoTotal ou #semanaConsulta não encontrados.');
        return;
    }

    try {
        const registros = decompressData(localStorage.getItem('registros') || compressData([]));
        const semanaSelecionada = semanaConsulta.value;
        let registrosFiltrados = [];
        const indicesOriginais = new Map(); // Mapa para armazenar índices originais

        if (semanaSelecionada) {
            const [ano, semana] = semanaSelecionada.split('-').map(Number);
            registros.forEach((registro, index) => {
                const data = new Date(registro.data);
                const anoRegistro = data.getUTCFullYear();
                const semanaRegistro = getWeekNumber(data);
                const isSameWeek = anoRegistro === ano && semanaRegistro === semana;
                if (isSameWeek) {
                    registrosFiltrados.push(registro);
                    indicesOriginais.set(registrosFiltrados.length - 1, index); // Mapear índice filtrado para original
                }
                console.log(`[financeiro.js] Filtrando registro: Data=${data.toISOString()}, Ano=${anoRegistro}, Semana=${semanaRegistro}, Selecionado=${semanaSelecionada}, Incluído=${isSameWeek}`);
            });
        } else {
            const hoje = new Date();
            const anoAtual = hoje.getUTCFullYear();
            const semanaAtual = getWeekNumber(hoje);
            registros.forEach((registro, index) => {
                const data = new Date(registro.data);
                const anoRegistro = data.getUTCFullYear();
                const semanaRegistro = getWeekNumber(data);
                const isCurrentWeek = anoRegistro === anoAtual && semanaRegistro === semanaAtual;
                if (isCurrentWeek) {
                    registrosFiltrados.push(registro);
                    indicesOriginais.set(registrosFiltrados.length - 1, index); // Mapear índice filtrado para original
                }
                console.log(`[financeiro.js] Filtrando semana atual: Data=${data.toISOString()}, Ano=${anoRegistro}, Semana=${semanaRegistro}, Atual=${anoAtual}-${semanaAtual}, Incluído=${isCurrentWeek}`);
            });
        }

        const registrosAgrupados = {};
        registrosFiltrados.forEach((registro, filteredIndex) => {
            const { descricao, tipo, valor } = registro;
            if (!registrosAgrupados[descricao]) {
                registrosAgrupados[descricao] = { gastos: 0, ganhos: 0, registros: [] };
            }
            if (tipo === 'gasto') {
                registrosAgrupados[descricao].gastos += valor;
            } else {
                registrosAgrupados[descricao].ganhos += valor;
            }
            registrosAgrupados[descricao].registros.push({
                ...registro,
                index: indicesOriginais.get(filteredIndex) // Usar índice original
            });
        });

        listaRegistros.innerHTML = '';
        let totalGastosValue = 0;
        let totalGanhosValue = 0;

        Object.keys(registrosAgrupados).sort().forEach(descricao => {
            const grupo = registrosAgrupados[descricao];
            const liGrupo = document.createElement('li');
            liGrupo.className = 'list-group-item';
            let htmlContent = `<strong>${descricao}</strong><br>`;
            if (grupo.ganhos > 0) {
                htmlContent += `Total de Ganhos: R$ ${grupo.ganhos.toFixed(2)}<br>`;
            }
            if (grupo.gastos > 0) {
                htmlContent += `Total de Gastos: R$ ${grupo.gastos.toFixed(2)}<br>`;
            }
            htmlContent += `<button class="btn btn-danger btn-sm" onclick="removerRegistrosAgrupados('${descricao}')" aria-label="Remover todos os registros com descrição ${descricao}">Remover Todos</button>`;
            htmlContent += `<ul class="list-group mt-2">`;
            
            grupo.registros.forEach(reg => {
                const dataFormatada = new Date(reg.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
                htmlContent += `
                    <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="font-size: 0.9em;">
                        <span>${reg.tipo === 'ganho' ? 'Ganho' : 'Gasto'}: R$ ${reg.valor.toFixed(2)} (${dataFormatada})</span>
                        <div>
                            <button class="btn btn-primary btn-sm mr-1" onclick="editarRegistro(${reg.index})" aria-label="Editar registro de ${reg.tipo} com descrição ${reg.descricao} e valor ${reg.valor.toFixed(2)}">✏️</button>
                            <button class="btn btn-danger btn-sm" onclick="removerRegistro(${reg.index})" aria-label="Remover registro de ${reg.tipo} com descrição ${reg.descricao} e valor ${reg.valor.toFixed(2)}">×</button>
                        </div>
                    </li>`;
            });
            
            htmlContent += `</ul>`;
            liGrupo.innerHTML = htmlContent;
            listaRegistros.appendChild(liGrupo);

            totalGastosValue += grupo.gastos;
            totalGanhosValue += grupo.ganhos;
        });

        totalGastos.textContent = totalGastosValue.toFixed(2);
        totalGanhos.textContent = totalGanhosValue.toFixed(2);
        saldoTotal.textContent = (totalGanhosValue - totalGastosValue).toFixed(2);
        console.log('[financeiro.js] Registros agrupados carregados:', Object.keys(registrosAgrupados).length, 'Total Gastos: R$', totalGastosValue.toFixed(2), 'Total Ganhos: R$', totalGanhosValue.toFixed(2), 'Saldo: R$', (totalGanhosValue - totalGastosValue).toFixed(2));
    } catch (e) {
        console.error('[financeiro.js] Erro ao carregar registros:', e);
        listaRegistros.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar registros.</li>';
        totalGastos.textContent = '0.00';
        totalGanhos.textContent = '0.00';
        saldoTotal.textContent = '0.00';
    }
}

function removerRegistrosAgrupados(descricao) {
    if (!confirm(`Deseja remover todos os registros com a descrição "${descricao}"?`)) return;

    try {
        let registros = decompressData(localStorage.getItem('registros') || compressData([]));
        registros = registros.filter(registro => registro.descricao !== descricao);
        if (checkStorageAvailability({ registros })) {
            localStorage.setItem('registros', compressData(registros));
            showToast('Registros removidos!', 'success');
            console.log('[financeiro.js] Registros com descrição removidos:', descricao);
            carregarRegistros();
        } else {
            throw new Error('Espaço insuficiente no localStorage.');
        }
    } catch (e) {
        showToast('Erro ao remover registros. Armazenamento cheio.', 'error');
        console.error('[financeiro.js] Erro ao remover registros agrupados:', e);
    }
}

function atualizarSemanas() {
    const semanaConsulta = document.getElementById('semanaConsulta');
    if (!semanaConsulta) {
        console.warn('[financeiro.js] Select #semanaConsulta não encontrado.');
        return;
    }

    try {
        const registros = decompressData(localStorage.getItem('registros') || compressData([]));
        const semanas = new Set();
        registros.forEach(registro => {
            const data = new Date(registro.data);
            const ano = data.getUTCFullYear();
            const semana = getWeekNumber(data);
            semanas.add(`${ano}-${semana}`);
        });

        semanaConsulta.innerHTML = '<option value="">Semana Atual</option>';
        Array.from(semanas).sort().reverse().forEach(semana => {
            const [ano, semanaNum] = semana.split('-').map(Number);
            const option = document.createElement('option');
            option.value = semana;
            option.textContent = `Semana ${semanaNum} de ${ano}`;
            semanaConsulta.appendChild(option);
        });

        console.log('[financeiro.js] Semanas atualizadas:', semanas.size);
    } catch (e) {
        console.error('[financeiro.js] Erro ao atualizar semanas:', e);
        semanaConsulta.innerHTML = '<option value="">Erro ao carregar semanas</option>';
    }
}