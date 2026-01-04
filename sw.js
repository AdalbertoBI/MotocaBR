const CACHE_NAME = 'motoca-br-v3.3';
const DATA_BACKUP_CACHE = 'data-backup-v3.3';
const FILES_TO_CACHE = [
    './',
    './index.html',
    './assets/css/style.css',
    './assets/css/analise-style.css',
    './assets/js/mapa.js',
    './assets/js/script.js',
    './assets/js/frete.js',
    './assets/js/financeiro.js',
    './assets/js/analise-corrida.js',
    './assets/js/analise-ui.js',
    './assets/js/install-prompt.js',
    './assets/js/update-checker.js',
    './assets/js/apk-installer.js',
    './assets/libs/bubbly-bg.min.js',
    './manifest.json',
    './img/icon-192x192.png'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando versão 3.3');
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
    console.log('[Service Worker] Ativando versão 3.3');
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