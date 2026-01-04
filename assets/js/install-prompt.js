// install-prompt.js - Popup de instalação do APK
// Detecta mobile e exibe prompt para instalar APK

(function() {
    'use strict';

    // Verificar se já foi exibido hoje
    function jaExibiuHoje() {
        const ultimaExibicao = localStorage.getItem('install-prompt-exibido');
        if (!ultimaExibicao) return false;
        
        const hoje = new Date().toISOString().split('T')[0];
        return ultimaExibicao === hoje;
    }

    // Marcar como exibido hoje
    function marcarComoExibido() {
        const hoje = new Date().toISOString().split('T')[0];
        localStorage.setItem('install-prompt-exibido', hoje);
    }

    // Detectar se é mobile
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detectar se é Android
    function isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    // Verificar se já está instalado como PWA
    function isInstalledPWA() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }

    // Criar e exibir o popup
    function exibirPopup() {
        // Não exibir se já foi mostrado hoje
        if (jaExibiuHoje()) return;
        
        // Não exibir se não for mobile
        if (!isMobile()) return;
        
        // Não exibir se já está instalado
        if (isInstalledPWA()) return;

        // Criar HTML do popup
        const popup = document.createElement('div');
        popup.id = 'install-popup';
        popup.className = 'install-popup';
        
        const isAndroidDevice = isAndroid();
        const apkUrl = 'https://adalbertobi.github.io/MotocaBR/motocabr.apk';
        
        popup.innerHTML = `
            <div class="install-popup-content">
                <button class="install-close" id="closeInstallPopup" aria-label="Fechar">×</button>
                
                <div class="install-icon">📱</div>
                
                <h2>Instalar Motoca BR</h2>
                
                ${isAndroidDevice ? `
                    <p>Baixe o aplicativo nativo para Android e tenha acesso offline!</p>
                    
                    <div class="install-benefits">
                        <div class="benefit-item">
                            <span class="benefit-icon">⚡</span>
                            <span>Mais rápido</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">📴</span>
                            <span>Funciona offline</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">🔔</span>
                            <span>Notificações</span>
                        </div>
                    </div>
                    
                    <button class="btn-install-primary" id="btnDownloadAPK">
                        📥 Baixar APK (Android)
                    </button>
                    
                    <div class="install-steps">
                        <p><strong>Como instalar:</strong></p>
                        <ol>
                            <li>Clique em "Baixar APK"</li>
                            <li>Abra o arquivo baixado</li>
                            <li>Permita instalar de fontes desconhecidas</li>
                            <li>Clique em "Instalar"</li>
                        </ol>
                    </div>
                ` : `
                    <p>Adicione à tela inicial para acesso rápido!</p>
                    
                    <div class="install-steps">
                        <p><strong>Como instalar:</strong></p>
                        <ol>
                            <li>Toque no botão de compartilhar <span style="font-size: 1.2em;">⎙</span></li>
                            <li>Selecione "Adicionar à Tela Inicial"</li>
                            <li>Confirme a instalação</li>
                        </ol>
                    </div>
                    
                    <button class="btn-install-secondary" id="btnClosePWA">
                        Entendi
                    </button>
                `}
                
                <button class="btn-install-secondary" id="btnLembrarDepois">
                    Lembrar amanhã
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Event listeners
        document.getElementById('closeInstallPopup').addEventListener('click', fecharPopup);
        document.getElementById('btnLembrarDepois').addEventListener('click', lembrarDepois);
        
        if (isAndroidDevice) {
            document.getElementById('btnDownloadAPK').addEventListener('click', function() {
                window.location.href = apkUrl;
                marcarComoExibido();
                fecharPopup();
            });
        } else {
            document.getElementById('btnClosePWA').addEventListener('click', function() {
                marcarComoExibido();
                fecharPopup();
            });
        }
        
        // Fechar ao clicar fora
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                lembrarDepois();
            }
        });
        
        // Animar entrada
        setTimeout(() => {
            popup.classList.add('show');
        }, 500);
    }

    function fecharPopup() {
        const popup = document.getElementById('install-popup');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    }

    function lembrarDepois() {
        marcarComoExibido();
        fecharPopup();
    }

    // Adicionar estilos CSS
    function adicionarEstilos() {
        const style = document.createElement('style');
        style.textContent = `
            .install-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                opacity: 0;
                transition: opacity 0.3s ease;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .install-popup.show {
                opacity: 1;
            }
            
            .install-popup-content {
                background: var(--container-bg, #fff);
                border-radius: 20px;
                padding: 30px 25px;
                max-width: 400px;
                width: 100%;
                position: relative;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
                text-align: center;
            }
            
            .install-popup.show .install-popup-content {
                transform: scale(1);
            }
            
            .install-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 32px;
                cursor: pointer;
                color: var(--text-color, #333);
                opacity: 0.6;
                transition: opacity 0.2s;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .install-close:hover {
                opacity: 1;
            }
            
            .install-icon {
                font-size: 60px;
                margin-bottom: 15px;
            }
            
            .install-popup-content h2 {
                margin: 0 0 15px;
                font-size: 1.5rem;
                color: var(--text-color, #333);
            }
            
            .install-popup-content p {
                margin: 0 0 20px;
                color: var(--text-color, #666);
                line-height: 1.5;
            }
            
            .install-benefits {
                display: flex;
                justify-content: space-around;
                margin: 20px 0;
                gap: 10px;
            }
            
            .benefit-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                flex: 1;
            }
            
            .benefit-icon {
                font-size: 32px;
            }
            
            .benefit-item span:last-child {
                font-size: 0.9rem;
                color: var(--text-color, #666);
            }
            
            .btn-install-primary {
                width: 100%;
                padding: 15px;
                font-size: 1.1rem;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                margin-bottom: 10px;
                transition: transform 0.2s;
            }
            
            .btn-install-primary:hover {
                transform: translateY(-2px);
            }
            
            .btn-install-secondary {
                width: 100%;
                padding: 12px;
                font-size: 1rem;
                background: var(--btn-secondary-bg, #6c757d);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                margin-top: 10px;
                transition: background 0.2s;
            }
            
            .btn-install-secondary:hover {
                background: var(--btn-secondary-hover, #545b62);
            }
            
            .install-steps {
                text-align: left;
                background: var(--config-section-bg, #f8f9fa);
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
            }
            
            .install-steps p {
                margin: 0 0 10px;
                font-size: 0.95rem;
            }
            
            .install-steps ol {
                margin: 0;
                padding-left: 20px;
            }
            
            .install-steps li {
                margin-bottom: 8px;
                color: var(--text-color, #666);
                line-height: 1.4;
            }
            
            @media (max-width: 480px) {
                .install-popup-content {
                    padding: 25px 20px;
                }
                
                .install-icon {
                    font-size: 50px;
                }
                
                .install-popup-content h2 {
                    font-size: 1.3rem;
                }
                
                .benefit-icon {
                    font-size: 28px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Inicializar
    function init() {
        adicionarEstilos();
        
        // Exibir popup após 3 segundos (tempo para o usuário ver a página)
        setTimeout(exibirPopup, 3000);
    }

    // Executar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
