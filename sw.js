const CACHE_NAME = 'motoca-br-v3.0';
const DATA_BACKUP_CACHE = 'data-backup-v3.0';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css?v=3.0',
    '/analise-style.css?v=1.0',
    '/mapa.js?v=2.3',
    '/script.js?v=2.3',
    '/frete.js?v=2.3',
    '/financeiro.js?v=2.3',
    '/analise-corrida.js?v=1.0',
    '/analise-ui.js?v=1.0',
    '/install-prompt.js?v=1.0',
    '/manifest.json',
    '/img/icon-192x192.png'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando versão 3.0');
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME)
                .then((cache) => {
                    console.log('[Service Worker] Armazenando arquivos em cache');
                    return cache.addAll(FILES_TO_CACHE);
                }),
            // Backup dos dados do localStorage
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'BACKUP_LOCAL_STORAGE' });
                });
            })
        ]).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando versão 2.3');
    event.waitUntil(
        Promise.all([
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== DATA_BACKUP_CACHE) {
                            console.log('[Service Worker] Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Restaurar dados após ativação
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'RESTORE_LOCAL_STORAGE' });
                });
            })
        ]).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/index.html');
            })
    );
});

self.addEventListener('message', (event) => {
    if (event.data.type === 'SAVE_BACKUP') {
        caches.open(DATA_BACKUP_CACHE).then(cache => {
            cache.put('/localStorageBackup', new Response(JSON.stringify(event.data.data)));
            console.log('[Service Worker] Dados do localStorage salvos no cache de backup.');
        });
    } else if (event.data.type === 'GET_BACKUP') {
        caches.open(DATA_BACKUP_CACHE).then(cache => {
            cache.match('/localStorageBackup').then(response => {
                if (response) {
                    response.json().then(data => {
                        event.ports[0].postMessage({ data });
                    });
                } else {
                    event.ports[0].postMessage({ data: {} });
                }
            });
        });
    }
});