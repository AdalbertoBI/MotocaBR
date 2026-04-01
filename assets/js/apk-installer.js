/**
 * APK Install Manager - Motoca BR
 * Sistema de detecção e instalação automática de APK para dispositivos Android
 * Versão: 1.0
 */

class APKInstallManager {
    constructor() {
        this.APK_URL = 'https://github.com/AdalbertoBI/MotocaBR/releases/latest/download/MotocaBR.apk';
        this.FALLBACK_URL = 'https://github.com/AdalbertoBI/MotocaBR/releases/latest';
        this.RELEASE_API_URL = 'https://api.github.com/repos/AdalbertoBI/MotocaBR/releases/latest';
        
        this.isAndroid = this.detectAndroid();
        this.canInstallAPK = this.isAndroid && !this.isInstalledApp();
        
        if (this.canInstallAPK) {
            this.init();
        }
    }

    /**
     * Detecta se o dispositivo é Android
     */
    detectAndroid() {
        const ua = navigator.userAgent.toLowerCase();
        return /android/.test(ua);
    }

    /**
     * Verifica se está rodando como app instalado (TWA ou PWA)
     */
    isInstalledApp() {
        // Detecta TWA (Trusted Web Activity)
        if (document.referrer.includes('android-app://')) {
            return true;
        }
        
        // Detecta PWA instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        
        // Detecta navegador nativo Android (pode ser TWA)
        if (navigator.standalone || window.navigator.standalone) {
            return true;
        }
        
        return false;
    }

    /**
     * Inicializa o sistema de instalação
     */
    async init() {
        try {
            // Verifica se já foi oferecido recentemente
            const lastOffer = localStorage.getItem('apk_install_last_offer');
            const daysSinceLastOffer = lastOffer 
                ? Math.floor((Date.now() - parseInt(lastOffer)) / (1000 * 60 * 60 * 24))
                : 999;
            
            // Oferece apenas se passou mais de 7 dias ou nunca foi oferecido
            if (daysSinceLastOffer < 7) {
                console.log('APK já foi oferecido recentemente');
                return;
            }

            // Busca informações da release
            const releaseInfo = await this.fetchReleaseInfo();
            
            // Cria e exibe prompt de instalação
            this.showInstallPrompt(releaseInfo);
            
        } catch (error) {
            console.error('Erro ao inicializar APK Install Manager:', error);
        }
    }

    /**
     * Busca informações da última release no GitHub
     */
    async fetchReleaseInfo() {
        try {
            const response = await fetch(this.RELEASE_API_URL, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });
            
            // Se não houver releases (404), retorna info padrão
            if (response.status === 404) {
                console.log('[APK Installer] Nenhuma release com APK disponível ainda');
                return {
                    version: (window.MOTOCA_VERSION && window.MOTOCA_VERSION.app) || '3.4',
                    name: 'Motoca BR',
                    downloadUrl: this.FALLBACK_URL,
                    size: '~2 MB',
                    publishedAt: new Date().toLocaleDateString('pt-BR')
                };
            }
            
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            
            const data = await response.json();
            
            // Busca o asset APK
            const apkAsset = data.assets.find(asset => 
                asset.name.endsWith('.apk')
            );
            
            return {
                version: data.tag_name,
                name: data.name,
                downloadUrl: apkAsset?.browser_download_url || this.FALLBACK_URL,
                size: apkAsset ? this.formatBytes(apkAsset.size) : 'N/A',
                publishedAt: new Date(data.published_at).toLocaleDateString('pt-BR')
            };
            
        } catch (error) {
            console.warn('Erro ao buscar release info:', error);
            return {
                version: (window.MOTOCA_VERSION && window.MOTOCA_VERSION.app) || '3.4',
                name: 'Motoca BR',
                downloadUrl: this.FALLBACK_URL,
                size: '~2 MB',
                publishedAt: new Date().toLocaleDateString('pt-BR')
            };
        }
    }

    /**
     * Formata bytes para formato legível
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Exibe prompt de instalação do APK
     */
    showInstallPrompt(releaseInfo) {
        // Cria o HTML do prompt
        const promptHTML = `
            <div id="apk-install-prompt" class="apk-install-backdrop">
                <div class="apk-install-modal">
                    <div class="apk-modal-header">
                        <div class="apk-icon">📱</div>
                        <h3>Instalar App Nativo</h3>
                    </div>
                    
                    <div class="apk-modal-body">
                        <p class="apk-description">
                            Disponível versão nativa (APK) para Android com melhor desempenho e experiência!
                        </p>
                        
                        <div class="apk-info">
                            <div class="apk-info-item">
                                <span class="apk-info-label">Versão:</span>
                                <span class="apk-info-value">${releaseInfo.version}</span>
                            </div>
                            <div class="apk-info-item">
                                <span class="apk-info-label">Tamanho:</span>
                                <span class="apk-info-value">${releaseInfo.size}</span>
                            </div>
                            <div class="apk-info-item">
                                <span class="apk-info-label">Data:</span>
                                <span class="apk-info-value">${releaseInfo.publishedAt}</span>
                            </div>
                        </div>
                        
                        <div class="apk-features">
                            <h4>✨ Vantagens do App Nativo:</h4>
                            <ul>
                                <li>🚀 Desempenho superior</li>
                                <li>📴 Funciona totalmente offline</li>
                                <li>🔔 Notificações nativas</li>
                                <li>🎨 Integração total com Android</li>
                                <li>🔄 Atualizações automáticas do conteúdo</li>
                            </ul>
                        </div>
                        
                        <div class="apk-warning">
                            ⚠️ <small>Após baixar, você precisará permitir instalação de "Fontes desconhecidas" nas configurações do Android.</small>
                        </div>
                    </div>
                    
                    <div class="apk-modal-actions">
                        <button id="apk-install-download" class="apk-btn apk-btn-primary">
                            ⬇️ Baixar APK
                        </button>
                        <button id="apk-install-later" class="apk-btn apk-btn-secondary">
                            Agora Não
                        </button>
                        <button id="apk-install-never" class="apk-btn apk-btn-text">
                            Não mostrar novamente
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Adiciona CSS
        this.injectStyles();
        
        // Adiciona HTML ao body
        document.body.insertAdjacentHTML('beforeend', promptHTML);
        
        // Adiciona event listeners
        this.attachEventListeners(releaseInfo.downloadUrl);
        
        // Registra que foi oferecido
        localStorage.setItem('apk_install_last_offer', Date.now().toString());
    }

    /**
     * Injeta estilos CSS para o prompt
     */
    injectStyles() {
        if (document.getElementById('apk-install-styles')) return;
        
        const styles = `
            <style id="apk-install-styles">
                .apk-install-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    padding: 20px;
                    animation: apkFadeIn 0.3s ease-out;
                }

                @keyframes apkFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .apk-install-modal {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: apkSlideUp 0.4s ease-out;
                }

                @keyframes apkSlideUp {
                    from { 
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to { 
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .apk-modal-header {
                    text-align: center;
                    padding: 30px 20px 20px;
                    color: white;
                }

                .apk-icon {
                    font-size: 64px;
                    margin-bottom: 10px;
                    animation: apkBounce 0.6s ease-in-out infinite alternate;
                }

                @keyframes apkBounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-10px); }
                }

                .apk-modal-header h3 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                }

                .apk-modal-body {
                    background: white;
                    padding: 25px;
                    border-radius: 15px 15px 0 0;
                }

                .apk-description {
                    font-size: 16px;
                    color: #333;
                    margin: 0 0 20px;
                    line-height: 1.5;
                }

                .apk-info {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 20px;
                }

                .apk-info-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e9ecef;
                }

                .apk-info-item:last-child {
                    border-bottom: none;
                }

                .apk-info-label {
                    font-weight: 600;
                    color: #666;
                }

                .apk-info-value {
                    color: #333;
                    font-weight: 500;
                }

                .apk-features {
                    margin: 20px 0;
                }

                .apk-features h4 {
                    margin: 0 0 10px;
                    font-size: 16px;
                    color: #667eea;
                }

                .apk-features ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .apk-features li {
                    padding: 8px 0;
                    color: #555;
                    font-size: 14px;
                }

                .apk-warning {
                    background: #fff3cd;
                    border: 1px solid #ffc107;
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 15px;
                    color: #856404;
                    font-size: 13px;
                    line-height: 1.4;
                }

                .apk-modal-actions {
                    background: white;
                    padding: 20px 25px 25px;
                    border-radius: 0 0 15px 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .apk-btn {
                    border: none;
                    border-radius: 12px;
                    padding: 15px 20px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .apk-btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .apk-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }

                .apk-btn-secondary {
                    background: #e9ecef;
                    color: #495057;
                }

                .apk-btn-secondary:hover {
                    background: #dee2e6;
                }

                .apk-btn-text {
                    background: transparent;
                    color: #6c757d;
                    padding: 10px;
                    font-size: 14px;
                }

                .apk-btn-text:hover {
                    color: #495057;
                }

                @media (max-width: 480px) {
                    .apk-install-modal {
                        border-radius: 15px;
                    }
                    
                    .apk-modal-header h3 {
                        font-size: 20px;
                    }
                    
                    .apk-icon {
                        font-size: 48px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    /**
     * Adiciona event listeners aos botões
     */
    attachEventListeners(downloadUrl) {
        const backdrop = document.getElementById('apk-install-prompt');
        const downloadBtn = document.getElementById('apk-install-download');
        const laterBtn = document.getElementById('apk-install-later');
        const neverBtn = document.getElementById('apk-install-never');

        downloadBtn.addEventListener('click', () => {
            this.downloadAPK(downloadUrl);
            this.closePrompt();
        });

        laterBtn.addEventListener('click', () => {
            this.closePrompt();
        });

        neverBtn.addEventListener('click', () => {
            localStorage.setItem('apk_install_never_show', 'true');
            this.closePrompt();
        });

        // Fecha ao clicar fora
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                this.closePrompt();
            }
        });
    }

    /**
     * Inicia download do APK
     */
    downloadAPK(url) {
        console.log('Iniciando download do APK:', url);
        
        // Cria link de download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'MotocaBR.apk';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Dispara download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Exibe instruções pós-download
        this.showDownloadInstructions();
        
        // Registra evento
        if (typeof gtag !== 'undefined') {
            gtag('event', 'apk_download_initiated', {
                'event_category': 'engagement',
                'event_label': 'APK Download Android'
            });
        }
    }

    /**
     * Exibe instruções após iniciar o download
     */
    showDownloadInstructions() {
        setTimeout(() => {
            const instructions = `
                📱 Download iniciado!
                
                Para instalar o APK:
                1. Abra as notificações
                2. Toque no arquivo baixado
                3. Permita instalação de fontes desconhecidas (se solicitado)
                4. Toque em "Instalar"
                
                Qualquer dúvida, acesse:
                github.com/AdalbertoBI/MotocaBR
            `;
            
            if (confirm(instructions)) {
                window.open('https://github.com/AdalbertoBI/MotocaBR/releases/latest', '_blank');
            }
        }, 1000);
    }

    /**
     * Fecha o prompt
     */
    closePrompt() {
        const prompt = document.getElementById('apk-install-prompt');
        if (prompt) {
            prompt.style.animation = 'apkFadeOut 0.3s ease-out';
            setTimeout(() => prompt.remove(), 300);
        }
    }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new APKInstallManager();
    });
} else {
    new APKInstallManager();
}

// Adiciona animação de fade out ao CSS
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes apkFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);
