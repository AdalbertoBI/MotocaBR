// update-checker.js - Sistema de verificação de atualizações
// Verifica se há nova versão disponível no GitHub

(function() {
    'use strict';

    const APP_VERSION = '3.1'; // Atualizar manualmente a cada release
    const GITHUB_API = 'https://api.github.com/repos/AdalbertoBI/MotocaBR/releases/latest';
    const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // Verificar a cada 24h

    function getLastCheckTime() {
        return parseInt(localStorage.getItem('lastUpdateCheck') || '0');
    }

    function setLastCheckTime() {
        localStorage.setItem('lastUpdateCheck', Date.now().toString());
    }

    function shouldCheckForUpdates() {
        const lastCheck = getLastCheckTime();
        const now = Date.now();
        return (now - lastCheck) > CHECK_INTERVAL;
    }

    async function checkForUpdates() {
        if (!shouldCheckForUpdates()) {
            console.log('[UpdateChecker] Verificação de atualização não necessária ainda');
            return;
        }

        try {
            console.log('[UpdateChecker] Verificando atualizações...');
            
            const response = await fetch(GITHUB_API);
            if (!response.ok) {
                throw new Error('Erro ao buscar releases');
            }

            const release = await response.json();
            const latestVersion = release.tag_name.replace('v', '');
            
            setLastCheckTime();

            if (compareVersions(latestVersion, APP_VERSION) > 0) {
                // Nova versão disponível!
                showUpdateNotification(latestVersion, release);
            } else {
                console.log('[UpdateChecker] App está atualizado (v' + APP_VERSION + ')');
            }
        } catch (error) {
            console.error('[UpdateChecker] Erro ao verificar atualizações:', error);
        }
    }

    function compareVersions(v1, v2) {
        // Compara versões no formato X.Y.Z
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            
            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }
        
        return 0;
    }

    function showUpdateNotification(version, release) {
        console.log('[UpdateChecker] Nova versão disponível: v' + version);

        // Criar notificação visual
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">🆕</div>
                <div class="update-info">
                    <h3>Nova versão disponível!</h3>
                    <p>Versão ${version} já está disponível para download.</p>
                    <p class="current-version">Você está usando: v${APP_VERSION}</p>
                </div>
                <div class="update-actions">
                    <button id="btnDownloadUpdate" class="btn-update-primary">
                        📥 Baixar Atualização
                    </button>
                    <button id="btnDismissUpdate" class="btn-update-secondary">
                        Lembrar depois
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Adicionar estilos
        addUpdateStyles();

        // Event listeners
        document.getElementById('btnDownloadUpdate').addEventListener('click', () => {
            // Buscar o APK nos assets do release
            const apkAsset = release.assets.find(asset => 
                asset.name.endsWith('.apk') || asset.name.includes('motocabr')
            );

            if (apkAsset) {
                window.open(apkAsset.browser_download_url, '_blank');
            } else {
                // Se não encontrar APK, abrir página de releases
                window.open(release.html_url, '_blank');
            }

            notification.remove();
            // Marcar para não mostrar novamente por 7 dias
            localStorage.setItem('updateDismissed', Date.now().toString());
        });

        document.getElementById('btnDismissUpdate').addEventListener('click', () => {
            notification.remove();
            // Marcar para não mostrar novamente por 3 dias
            localStorage.setItem('updateDismissed', Date.now().toString());
        });

        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Vibrar para chamar atenção
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    function addUpdateStyles() {
        if (document.getElementById('update-styles')) return;

        const style = document.createElement('style');
        style.id = 'update-styles';
        style.textContent = `
            .update-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(200px);
                max-width: 500px;
                width: 90%;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 99999;
                transition: transform 0.4s ease;
                padding: 20px;
            }

            .update-notification.show {
                transform: translateX(-50%) translateY(0);
            }

            .update-content {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .update-icon {
                font-size: 3rem;
                text-align: center;
            }

            .update-info {
                text-align: center;
            }

            .update-info h3 {
                margin: 0 0 10px;
                color: #333;
                font-size: 1.3rem;
            }

            .update-info p {
                margin: 5px 0;
                color: #666;
                line-height: 1.5;
            }

            .current-version {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .update-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 10px;
            }

            .btn-update-primary,
            .btn-update-secondary {
                padding: 15px;
                border: none;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-update-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .btn-update-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }

            .btn-update-secondary {
                background: #e0e0e0;
                color: #333;
            }

            .btn-update-secondary:hover {
                background: #d0d0d0;
            }

            body.dark-mode .update-notification {
                background: #2c2c2c;
            }

            body.dark-mode .update-info h3 {
                color: #e0e0e0;
            }

            body.dark-mode .update-info p {
                color: #b0b0b0;
            }

            body.dark-mode .btn-update-secondary {
                background: #4a4a4a;
                color: #e0e0e0;
            }

            body.dark-mode .btn-update-secondary:hover {
                background: #5a5a5a;
            }

            @media (max-width: 600px) {
                .update-notification {
                    bottom: 10px;
                    width: 95%;
                }

                .update-info h3 {
                    font-size: 1.1rem;
                }

                .btn-update-primary,
                .btn-update-secondary {
                    font-size: 1rem;
                    padding: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Verificar se usuário já dispensou a atualização recentemente
    function wasRecentlyDismissed() {
        const dismissed = parseInt(localStorage.getItem('updateDismissed') || '0');
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        return (Date.now() - dismissed) < threeDays;
    }

    // Inicializar verificação
    function init() {
        // Não verificar se dispensado recentemente
        if (wasRecentlyDismissed()) {
            console.log('[UpdateChecker] Atualização dispensada recentemente');
            return;
        }

        // Aguardar 5 segundos após carregamento para não atrapalhar UX
        setTimeout(() => {
            checkForUpdates();
        }, 5000);
    }

    // Executar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expor função global para verificação manual
    window.checkForUpdates = checkForUpdates;

})();
