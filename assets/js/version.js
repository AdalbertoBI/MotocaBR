/**
 * version.js — Fonte única de verdade para versões do Motoca BR
 *
 * ⚠️  APENAS ESTE ARQUIVO precisa ser editado ao fazer um novo release.
 *
 * Usado por:
 *  - index.html        → ?v= nos scripts/css (bust de cache)
 *  - sw.js             → CACHE_NAME e DATA_BACKUP_CACHE (via importScripts)
 *  - update-checker.js → comparação com a última release do GitHub
 *  - apk-installer.js  → fallback de versão quando GitHub não responde
 *  - db.js             → versão do schema IndexedDB
 */

'use strict';

// ─── Versão pública do app (deve bater com a tag GitHub) ─────────────────────
const APP_VERSION = '3.5';

// ─── Versão do cache do Service Worker ───────────────────────────────────────
const CACHE_VERSION = 'v3.5';

// ─── Versão do schema IndexedDB ──────────────────────────────────────────────
const DB_SCHEMA_VERSION = 1;

// ─── Data de build (gerada manualmente a cada release) ───────────────────────
const BUILD_DATE = '2026-04-01';

// ─── Namespace global (disponível em todos os scripts da página) ─────────────
// Só cria o objeto se ainda não existe (evita sobrescrever em re-execuções)
if (typeof window !== 'undefined') {
    window.MOTOCA_VERSION = {
        /** "3.4" — versão semântica pública do app */
        app:        APP_VERSION,
        /** "v3.4" — prefixo usado nos nomes de cache do SW */
        cache:      CACHE_VERSION,
        /** 1 — versão do schema IndexedDB */
        dbSchema:   DB_SCHEMA_VERSION,
        /** "2026-04-01" — data do build atual */
        buildDate:  BUILD_DATE,
        /** "motoca-br-v3.4" — nome completo do cache principal */
        cacheName:  'motoca-br-' + CACHE_VERSION,
        /** "data-backup-v3.4" — nome do cache de backup de dados */
        dataCache:  'data-backup-' + CACHE_VERSION,
    };
    console.log('[version.js] Motoca BR v' + APP_VERSION + ' (' + BUILD_DATE + ')');
}

// ─── Exposição para Service Worker (importScripts não tem window) ─────────────
// O SW faz: importScripts('./assets/js/version.js')
// e acessa diretamente APP_VERSION, CACHE_VERSION (são var globais no contexto SW)
