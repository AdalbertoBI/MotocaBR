/**
 * db.js — Camada de persistência IndexedDB do Motoca BR
 * Substitui o uso de localStorage para dados do usuário.
 *
 * Stores:
 *   - registros        : ganhos e gastos financeiros  { id (autoIncrement), tipo, descricao, valor, data }
 *   - historicoAnalises: análises de corrida            { id (autoIncrement), timestamp, app, valor, distancia, tempo, lucros, recomendacao, aceita }
 *   - estatisticas     : estatísticas diárias           { dateKey (keyPath), total, aceitas, recusadas, somaLucro, somaDistancia, somaTempo, porApp }
 *   - config           : chave-valor de configurações   { key (keyPath), value }
 *   - cache            : cache de geocodificação        { key (keyPath), value, ts }
 *
 * Versão do schema: 1
 */

const MotocaDB = (() => {
    'use strict';

    const DB_NAME    = 'motocabr';
    const DB_VERSION = 1;

    /** @type {IDBDatabase|null} */
    let _db = null;

    // ─── abertura / upgrade ───────────────────────────────────────────────────

    function open() {
        if (_db) return Promise.resolve(_db);

        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);

            req.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('registros')) {
                    const store = db.createObjectStore('registros', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('data',      'data',      { unique: false });
                    store.createIndex('tipo',      'tipo',      { unique: false });
                    store.createIndex('descricao', 'descricao', { unique: false });
                }

                if (!db.objectStoreNames.contains('historicoAnalises')) {
                    const store = db.createObjectStore('historicoAnalises', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('app',       'app',       { unique: false });
                }

                if (!db.objectStoreNames.contains('estatisticas')) {
                    db.createObjectStore('estatisticas', { keyPath: 'dateKey' });
                }

                if (!db.objectStoreNames.contains('config')) {
                    db.createObjectStore('config', { keyPath: 'key' });
                }

                if (!db.objectStoreNames.contains('cache')) {
                    const store = db.createObjectStore('cache', { keyPath: 'key' });
                    store.createIndex('ts', 'ts', { unique: false });
                }
            };

            req.onsuccess = (event) => {
                _db = event.target.result;

                _db.onversionchange = () => {
                    _db.close();
                    _db = null;
                    console.warn('[MotocaDB] Banco de dados atualizado em outra aba. Recarregue a página.');
                };

                console.log('[MotocaDB] Banco aberto com sucesso (v' + DB_VERSION + ').');
                resolve(_db);
            };

            req.onerror = (event) => {
                console.error('[MotocaDB] Erro ao abrir banco:', event.target.error);
                reject(event.target.error);
            };

            req.onblocked = () => {
                console.warn('[MotocaDB] Abertura bloqueada — feche outras abas com o app.');
            };
        });
    }

    // ─── helpers internos ────────────────────────────────────────────────────

    function tx(storeName, mode, fn) {
        return open().then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, mode);
            const store       = transaction.objectStore(storeName);

            transaction.onerror   = e => reject(e.target.error);
            transaction.onabort   = e => reject(e.target.error);

            try {
                fn(store, resolve, reject);
            } catch (err) {
                reject(err);
            }
        }));
    }

    function getAll(storeName) {
        return tx(storeName, 'readonly', (store, resolve, reject) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror   = e  => reject(e.target.error);
        });
    }

    function getByKey(storeName, key) {
        return tx(storeName, 'readonly', (store, resolve, reject) => {
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror   = e  => reject(e.target.error);
        });
    }

    function put(storeName, record) {
        return tx(storeName, 'readwrite', (store, resolve, reject) => {
            const req = store.put(record);
            req.onsuccess = () => resolve(req.result);
            req.onerror   = e  => reject(e.target.error);
        });
    }

    function add(storeName, record) {
        return tx(storeName, 'readwrite', (store, resolve, reject) => {
            const req = store.add(record);
            req.onsuccess = () => resolve(req.result); // retorna novo id
            req.onerror   = e  => reject(e.target.error);
        });
    }

    function remove(storeName, key) {
        return tx(storeName, 'readwrite', (store, resolve, reject) => {
            const req = store.delete(key);
            req.onsuccess = () => resolve();
            req.onerror   = e  => reject(e.target.error);
        });
    }

    function clear(storeName) {
        return tx(storeName, 'readwrite', (store, resolve, reject) => {
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror   = e  => reject(e.target.error);
        });
    }

    // ─── migração do localStorage ─────────────────────────────────────────────

    /**
     * Executa uma vez: copia dados que ainda estão no localStorage para o IndexedDB
     * e remove as chaves migradas para liberar espaço.
     */
    async function migrarLocalStorage() {
        const migrationKey = 'idb_migration_v1_done';
        if (localStorage.getItem(migrationKey)) return;

        console.log('[MotocaDB] Iniciando migração do localStorage...');

        // ── registros financeiros ───────────────────────────────────────────
        try {
            const raw = localStorage.getItem('registros');
            if (raw) {
                const lista = JSON.parse(raw);
                if (Array.isArray(lista) && lista.length > 0) {
                    for (const r of lista) {
                        // Garante que não há campo 'id' herdado (evita conflito com autoIncrement)
                        const { id: _id, ...resto } = r;
                        await add('registros', resto);
                    }
                    console.log(`[MotocaDB] Migrados ${lista.length} registros financeiros.`);
                }
                localStorage.removeItem('registros');
            }
        } catch (e) {
            console.error('[MotocaDB] Erro ao migrar registros:', e);
        }

        // ── histórico de análises ──────────────────────────────────────────
        try {
            const raw = localStorage.getItem('historicoAnalises');
            if (raw) {
                const lista = JSON.parse(raw);
                if (Array.isArray(lista) && lista.length > 0) {
                    for (const r of lista) {
                        const { id: _id, ...resto } = r;
                        await add('historicoAnalises', resto);
                    }
                    console.log(`[MotocaDB] Migradas ${lista.length} análises.`);
                }
                localStorage.removeItem('historicoAnalises');
            }
        } catch (e) {
            console.error('[MotocaDB] Erro ao migrar histórico de análises:', e);
        }

        // ── estatísticas diárias ───────────────────────────────────────────
        try {
            const raw = localStorage.getItem('estatisticasAnalises');
            if (raw) {
                const obj = JSON.parse(raw);
                for (const [dateKey, val] of Object.entries(obj)) {
                    await put('estatisticas', { dateKey, ...val });
                }
                console.log('[MotocaDB] Estatísticas migradas.');
                localStorage.removeItem('estatisticasAnalises');
            }
        } catch (e) {
            console.error('[MotocaDB] Erro ao migrar estatísticas:', e);
        }

        // ── configurações (chave-valor) ────────────────────────────────────
        const configKeys = [
            'kmPorLitro', 'precoPorLitro',
            'minLucroKm', 'minLucroHora', 'minLucroMin',
            'criterios_analise', 'theme'
        ];
        for (const key of configKeys) {
            try {
                const val = localStorage.getItem(key);
                if (val !== null) {
                    await put('config', { key, value: val });
                    localStorage.removeItem(key);
                }
            } catch (e) {
                console.error(`[MotocaDB] Erro ao migrar config "${key}":`, e);
            }
        }

        // ── cache de geocodificação ────────────────────────────────────────
        try {
            const raw = localStorage.getItem('cacheBusca');
            if (raw) {
                const obj = JSON.parse(raw);
                const now = Date.now();
                for (const [key, value] of Object.entries(obj)) {
                    await put('cache', { key, value, ts: now });
                }
                console.log('[MotocaDB] Cache de busca migrado.');
                localStorage.removeItem('cacheBusca');
            }
        } catch (e) {
            console.error('[MotocaDB] Erro ao migrar cache de busca:', e);
        }

        localStorage.setItem(migrationKey, '1');
        console.log('[MotocaDB] Migração concluída.');
    }

    // ─── API pública ─────────────────────────────────────────────────────────

    // ---- config ----

    async function getConfig(key) {
        const row = await getByKey('config', key);
        return row ? row.value : null;
    }

    async function setConfig(key, value) {
        await put('config', { key, value: String(value) });
    }

    async function getConfigFloat(key, defaultVal) {
        const v = await getConfig(key);
        const n = parseFloat(v);
        return isNaN(n) ? defaultVal : n;
    }

    // ---- registros financeiros ----

    async function getRegistros() {
        return getAll('registros');
    }

    async function addRegistro(registro) {
        // registro: { tipo, descricao, valor, data }
        return add('registros', registro);
    }

    async function updateRegistro(registro) {
        // registro deve ter campo 'id'
        return put('registros', registro);
    }

    async function deleteRegistro(id) {
        return remove('registros', id);
    }

    async function deleteRegistrosByDescricao(descricao) {
        const todos = await getAll('registros');
        const alvo  = todos.filter(r => r.descricao === descricao);
        for (const r of alvo) {
            await remove('registros', r.id);
        }
        return alvo.length;
    }

    async function limparRegistrosAntigos(diasMaximos = 90) {
        const todos   = await getAll('registros');
        const limite  = Date.now() - diasMaximos * 24 * 60 * 60 * 1000;
        const antigos = todos.filter(r => new Date(r.data).getTime() < limite);
        for (const r of antigos) {
            await remove('registros', r.id);
        }
        console.log(`[MotocaDB] ${antigos.length} registro(s) antigo(s) removido(s).`);
        return antigos.length;
    }

    // ---- histórico de análises ----

    async function addAnalise(analise) {
        return add('historicoAnalises', analise);
    }

    async function getHistoricoAnalises(limite = 200) {
        const todos = await getAll('historicoAnalises');
        return todos
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limite);
    }

    async function updateAnaliseDecisao(id, aceita) {
        const registro = await getByKey('historicoAnalises', id);
        if (!registro) return;
        registro.aceita = aceita;
        return put('historicoAnalises', registro);
    }

    async function clearHistoricoAnalises() {
        return clear('historicoAnalises');
    }

    // ---- estatísticas diárias ----

    async function getEstatisticasByDateKey(dateKey) {
        return getByKey('estatisticas', dateKey);
    }

    async function putEstatisticas(dateKey, dados) {
        return put('estatisticas', { dateKey, ...dados });
    }

    async function limparEstatisticasAntigas(diasMaximos = 90) {
        const todas  = await getAll('estatisticas');
        const limite = new Date();
        limite.setDate(limite.getDate() - diasMaximos);
        const antigas = todas.filter(e => new Date(e.dateKey) < limite);
        for (const e of antigas) {
            await remove('estatisticas', e.dateKey);
        }
        return antigas.length;
    }

    // ---- cache de geocodificação ----

    const CACHE_MAX_ENTRIES = 200;
    const CACHE_MAX_AGE_MS  = 7 * 24 * 60 * 60 * 1000; // 7 dias

    async function getCacheItem(key) {
        const row = await getByKey('cache', key);
        if (!row) return null;
        if (Date.now() - row.ts > CACHE_MAX_AGE_MS) {
            await remove('cache', key);
            return null;
        }
        return row.value;
    }

    async function setCacheItem(key, value) {
        await put('cache', { key, value, ts: Date.now() });
        // Limpeza assíncrona se exceder o limite
        _pruneCache();
    }

    async function _pruneCache() {
        try {
            const todos = await getAll('cache');
            const agora = Date.now();

            // Remove expirados
            for (const row of todos) {
                if (agora - row.ts > CACHE_MAX_AGE_MS) {
                    await remove('cache', row.key);
                }
            }

            // Se ainda exceder o limite, remove os mais antigos
            const restantes = await getAll('cache');
            if (restantes.length > CACHE_MAX_ENTRIES) {
                restantes.sort((a, b) => a.ts - b.ts);
                const excesso = restantes.slice(0, restantes.length - CACHE_MAX_ENTRIES);
                for (const row of excesso) {
                    await remove('cache', row.key);
                }
            }
        } catch (e) {
            console.warn('[MotocaDB] Erro ao podar cache:', e);
        }
    }

    // ─── inicialização ────────────────────────────────────────────────────────

    /**
     * Deve ser chamado uma vez ao carregar o app.
     * Abre o banco e executa a migração do localStorage se necessário.
     */
    async function init() {
        await open();
        await migrarLocalStorage();
    }

    // ─── exposição pública ────────────────────────────────────────────────────

    return {
        init,

        // config
        getConfig,
        setConfig,
        getConfigFloat,

        // registros financeiros
        getRegistros,
        addRegistro,
        updateRegistro,
        deleteRegistro,
        deleteRegistrosByDescricao,
        limparRegistrosAntigos,

        // histórico de análises
        addAnalise,
        getHistoricoAnalises,
        updateAnaliseDecisao,
        clearHistoricoAnalises,

        // estatísticas
        getEstatisticasByDateKey,
        putEstatisticas,
        limparEstatisticasAntigas,

        // cache
        getCacheItem,
        setCacheItem,
    };
})();
