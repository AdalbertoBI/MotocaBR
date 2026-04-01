// swipe-tabs.js — Navegação por swipe/drag entre abas
// Suporta: touch (mobile) + mouse drag (desktop)
// Compatível com o sistema openTab() existente no index.html

(function () {
    'use strict';

    // Ordem das abas (deve corresponder aos IDs dos .tabcontent)
    const TAB_ORDER = ['Analise', 'Rotas', 'Frete', 'Financeiro'];

    // Limiar mínimo em px para reconhecer como swipe intencional
    const SWIPE_THRESHOLD = 60;

    // Limiar máximo de deslocamento vertical para cancelar swipe horizontal
    const VERTICAL_LOCK = 40;

    // Contêiner onde o swipe é detectado (toda a área de conteúdo)
    const SWIPE_TARGET = document;

    // Estado interno
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isDragging = false;
    let isMouseDrag = false;
    let lockedAxis = null; // 'horizontal' | 'vertical' | null

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /** Retorna o índice da aba atualmente ativa. */
    function getActiveIndex() {
        for (let i = 0; i < TAB_ORDER.length; i++) {
            const el = document.getElementById(TAB_ORDER[i]);
            if (el && el.classList.contains('active')) return i;
        }
        return 0;
    }

    /** Navega para a aba pelo índice, usando o openTab() já existente. */
    function goToTab(index) {
        if (index < 0 || index >= TAB_ORDER.length) return;
        const tabName = TAB_ORDER[index];
        // Encontra o botão da aba correspondente
        const btn = document.querySelector(`.tablink[onclick*="'${tabName}'"]`);
        if (btn) {
            // Cria evento sintético para reutilizar openTab()
            openTab({ currentTarget: btn }, tabName);
            // Rola a barra de abas para que o botão ativo fique visível
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    /** Exibe indicador visual de swipe (flash na borda lateral). */
    function showSwipeHint(direction) {
        const hint = document.getElementById('swipe-hint');
        if (!hint) return;
        hint.className = 'swipe-hint ' + direction;
        hint.classList.add('visible');
        clearTimeout(hint._timer);
        hint._timer = setTimeout(() => hint.classList.remove('visible'), 400);
    }

    // ─── Touch Events ────────────────────────────────────────────────────────

    function onTouchStart(e) {
        // Ignora multi-touch
        if (e.touches.length > 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        lockedAxis = null;
    }

    function onTouchMove(e) {
        if (e.touches.length > 1) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        // Determina eixo dominante na primeira movimentação
        if (!lockedAxis) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                lockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
            }
        }

        // Previne scroll da página apenas quando o swipe é horizontal
        if (lockedAxis === 'horizontal') {
            e.preventDefault();
        }
    }

    function onTouchEnd(e) {
        if (!lockedAxis) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        const elapsed = Date.now() - startTime;

        // Cancela se o deslocamento vertical for muito grande (scroll intencional)
        if (Math.abs(dy) > VERTICAL_LOCK) return;

        // Cancela se for demasiado lento (>600ms) ou o swipe horizontal for pequeno
        if (elapsed > 600 || Math.abs(dx) < SWIPE_THRESHOLD) return;

        handleSwipeGesture(dx);
    }

    // ─── Mouse Drag Events (desktop) ─────────────────────────────────────────

    function onMouseDown(e) {
        // Apenas botão esquerdo, e apenas no conteúdo das abas
        if (e.button !== 0) return;
        const target = e.target;
        // Não inicia drag em inputs, textareas, selects, botões, links, mapas
        if (target.closest('input, textarea, select, button, a, [data-no-swipe], .leaflet-container')) return;

        isMouseDrag = true;
        startX = e.clientX;
        startY = e.clientY;
        startTime = Date.now();
        lockedAxis = null;
    }

    function onMouseMove(e) {
        if (!isMouseDrag) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!lockedAxis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
            lockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
        }
    }

    function onMouseUp(e) {
        if (!isMouseDrag) return;
        isMouseDrag = false;
        if (lockedAxis !== 'horizontal') return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const elapsed = Date.now() - startTime;

        if (Math.abs(dy) > VERTICAL_LOCK) return;
        if (elapsed > 600 || Math.abs(dx) < SWIPE_THRESHOLD) return;

        handleSwipeGesture(dx);
    }

    // Cancela se o mouse sair da janela
    function onMouseLeave() {
        isMouseDrag = false;
    }

    // ─── Lógica central ──────────────────────────────────────────────────────

    function handleSwipeGesture(dx) {
        const current = getActiveIndex();
        if (dx < 0) {
            // Swipe para a esquerda → próxima aba
            if (current < TAB_ORDER.length - 1) {
                showSwipeHint('left');
                goToTab(current + 1);
            }
        } else {
            // Swipe para a direita → aba anterior
            if (current > 0) {
                showSwipeHint('right');
                goToTab(current - 1);
            }
        }
    }

    // ─── Teclado (setas esquerda/direita quando foco não está num input) ─────

    function onKeyDown(e) {
        // Ignora se o foco está em input, textarea, select
        if (document.activeElement && document.activeElement.matches('input, textarea, select')) return;
        if (e.key === 'ArrowRight') {
            const current = getActiveIndex();
            if (current < TAB_ORDER.length - 1) goToTab(current + 1);
        } else if (e.key === 'ArrowLeft') {
            const current = getActiveIndex();
            if (current > 0) goToTab(current - 1);
        }
    }

    // ─── Inicialização ───────────────────────────────────────────────────────

    function init() {
        // Cria o elemento de hint visual se ainda não existir
        if (!document.getElementById('swipe-hint')) {
            const hint = document.createElement('div');
            hint.id = 'swipe-hint';
            hint.setAttribute('aria-hidden', 'true');
            document.body.appendChild(hint);
        }

        // Touch (passive: false para permitir preventDefault no move horizontal)
        SWIPE_TARGET.addEventListener('touchstart', onTouchStart, { passive: true });
        SWIPE_TARGET.addEventListener('touchmove', onTouchMove, { passive: false });
        SWIPE_TARGET.addEventListener('touchend', onTouchEnd, { passive: true });

        // Mouse
        SWIPE_TARGET.addEventListener('mousedown', onMouseDown);
        SWIPE_TARGET.addEventListener('mousemove', onMouseMove);
        SWIPE_TARGET.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseleave', onMouseLeave);

        // Teclado
        SWIPE_TARGET.addEventListener('keydown', onKeyDown);

        console.log('[swipe-tabs.js] Navegação por swipe inicializada. Abas:', TAB_ORDER.join(' → '));
    }

    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
