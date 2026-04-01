// toast.js — Sistema de notificações não-bloqueantes
// Uso: showToast('Mensagem', 'success' | 'error' | 'warning' | 'info', duracaoMs?)
// Substitui todos os alert() do app por feedback visual empilhável.

(function (global) {
    'use strict';

    const DEFAULTS = {
        duration: 3500,   // ms até auto-fechar
        maxVisible: 5,    // máximo de toasts simultâneos
    };

    // Duração por tipo (pode ser sobrescrita no 3º argumento)
    const TYPE_DURATION = {
        success: 3000,
        error:   5000,
        warning: 4500,
        info:    3500,
    };

    // Ícones SVG inline (sem dependências externas)
    const ICONS = {
        success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd"/></svg>',
        error:   '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clip-rule="evenodd"/></svg>',
        warning: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
        info:    '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H10z" clip-rule="evenodd"/></svg>',
    };

    let container = null;

    /** Garante que o container existe no DOM. */
    function getContainer() {
        if (!container) {
            container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.setAttribute('aria-live', 'polite');
                container.setAttribute('aria-atomic', 'false');
                container.setAttribute('role', 'region');
                container.setAttribute('aria-label', 'Notificações');
                document.body.appendChild(container);
            }
        }
        return container;
    }

    /** Remove um toast do DOM com animação de saída. */
    function dismissToast(el) {
        if (el._dismissed) return;
        el._dismissed = true;
        clearTimeout(el._timer);
        el.classList.add('toast-exit');
        el.addEventListener('animationend', () => el.remove(), { once: true });
        // Fallback caso animationend não dispare
        setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
    }

    /**
     * Exibe uma notificação toast.
     * @param {string}  message   Texto da mensagem (suporta quebras de linha com \n)
     * @param {string}  [type]    'success' | 'error' | 'warning' | 'info' (padrão: 'info')
     * @param {number}  [duration] Duração em ms antes de fechar automaticamente (0 = manual)
     * @returns {HTMLElement} O elemento do toast criado
     */
    function showToast(message, type, duration) {
        const c = getContainer();

        // Limite de toasts visíveis: remove o mais antigo
        const existing = c.querySelectorAll('.toast-item:not(.toast-exit)');
        if (existing.length >= DEFAULTS.maxVisible) {
            dismissToast(existing[0]);
        }

        const resolvedType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
        const resolvedDuration = (typeof duration === 'number') ? duration : TYPE_DURATION[resolvedType];

        // Cria o elemento
        const toast = document.createElement('div');
        toast.className = `toast-item toast-${resolvedType}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', resolvedType === 'error' ? 'assertive' : 'polite');

        // Substitui \n por <br> para mensagens multi-linha
        const safeMsg = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');

        toast.innerHTML = `
            <span class="toast-icon">${ICONS[resolvedType]}</span>
            <span class="toast-message">${safeMsg}</span>
            <button class="toast-close" aria-label="Fechar notificação">&#x2715;</button>
        `;

        // Botão fechar
        toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

        // Pausa o timer ao hover (só desktop)
        if (resolvedDuration > 0) {
            toast.addEventListener('mouseenter', () => {
                clearTimeout(toast._timer);
                toast._remaining = toast._endTime - Date.now();
            });
            toast.addEventListener('mouseleave', () => {
                if (!toast._dismissed) {
                    toast._timer = setTimeout(() => dismissToast(toast), Math.max(toast._remaining || 0, 500));
                }
            });
        }

        c.appendChild(toast);

        // Auto-fechar
        if (resolvedDuration > 0) {
            toast._endTime = Date.now() + resolvedDuration;
            toast._remaining = resolvedDuration;
            toast._timer = setTimeout(() => dismissToast(toast), resolvedDuration);
        }

        return toast;
    }

    // Atalhos por tipo
    showToast.success = (msg, d) => showToast(msg, 'success', d);
    showToast.error   = (msg, d) => showToast(msg, 'error',   d);
    showToast.warning = (msg, d) => showToast(msg, 'warning', d);
    showToast.info    = (msg, d) => showToast(msg, 'info',    d);

    // Expõe globalmente
    global.showToast = showToast;

})(window);
