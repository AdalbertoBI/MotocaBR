// analise-ui.js - Interface para o Analisador de Corridas
// Integra o AnalisadorCorrida com a UI da aba Análise

(function() {
    'use strict';

    // Inicializar o analisador
    const analisador = new AnalisadorCorrida();
    let appSelecionado = null;

    // Elementos do DOM
    const appButtons = document.querySelectorAll('.app-btn-selector');
    const quickValor = document.getElementById('quickValor');
    const quickDistancia = document.getElementById('quickDistancia');
    const quickTempo = document.getElementById('quickTempo');
    const btnAnalisarAgora = document.getElementById('btnAnalisarAgora');
    const resultadoAnalise = document.getElementById('resultadoAnalise');
    const btnNovaAnalise = document.getElementById('btnNovaAnalise');
    const btnAcceptCorrida = document.getElementById('btnAcceptCorrida');
    const btnRejectCorrida = document.getElementById('btnRejectCorrida');
    const btnConfigCriterios = document.getElementById('btnConfigCriterios');
    const modalCriterios = document.getElementById('modalCriterios');
    const btnSalvarCriterios = document.getElementById('btnSalvarCriterios');
    const btnFecharModal = document.getElementById('btnFecharModal');

    // Variável para armazenar a última análise
    let ultimaAnalise = null;

    // Seleção de App
    appButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active de todos
            appButtons.forEach(b => b.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');
            appSelecionado = this.dataset.app;
            
            // Foca no primeiro input
            quickValor.focus();
        });
    });

    // Formatação de inputs
    function formatarMoeda(input) {
        let valor = input.value.replace(/[^\d,]/g, '');
        input.value = valor;
    }

    function formatarNumero(input) {
        let valor = input.value.replace(/[^\d,]/g, '');
        input.value = valor;
    }

    quickValor.addEventListener('input', function() {
        formatarMoeda(this);
    });

    quickDistancia.addEventListener('input', function() {
        formatarNumero(this);
    });

    quickTempo.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    // Navegação rápida com Enter
    quickValor.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            quickDistancia.focus();
        }
    });

    quickDistancia.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            quickTempo.focus();
        }
    });

    quickTempo.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            analisarCorrida();
        }
    });

    // Botão Analisar
    btnAnalisarAgora.addEventListener('click', analisarCorrida);

    async function analisarCorrida() {
        // Validar app selecionado
        if (!appSelecionado) {
            showToast('Por favor, selecione um aplicativo primeiro!', 'warning');
            return;
        }

        // Pegar e validar valores
        const valorStr = quickValor.value.replace(',', '.');
        const distanciaStr = quickDistancia.value.replace(',', '.');
        const tempoStr = quickTempo.value;

        const valor = parseFloat(valorStr);
        const distancia = parseFloat(distanciaStr);
        const tempo = parseInt(tempoStr);

        if (isNaN(valor) || valor <= 0) {
            showToast('Digite um valor válido para a corrida!', 'warning');
            quickValor.focus();
            return;
        }

        if (isNaN(distancia) || distancia <= 0) {
            showToast('Digite uma distância válida!', 'warning');
            quickDistancia.focus();
            return;
        }

        if (isNaN(tempo) || tempo <= 0) {
            showToast('Digite um tempo válido!', 'warning');
            quickTempo.focus();
            return;
        }

        // Realizar análise
        const resultado = await analisador.analisar({
            app: appSelecionado,
            valorCorrida: valor,
            distanciaTotal: distancia,
            tempoEstimado: tempo
        });

        ultimaAnalise = resultado;

        // Exibir resultado
        exibirResultado(resultado);

        // Esconder formulário e mostrar resultado
        document.querySelector('.analise-rapida').style.display = 'none';
        document.querySelector('.stats-today').style.display = 'none';
        resultadoAnalise.style.display = 'block';

        // Scroll suave para o resultado
        resultadoAnalise.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function exibirResultado(resultado) {
        // Semáforo
        const semaforoLuz = document.getElementById('semaforoLuz');
        semaforoLuz.className = 'semaforo-luz';
        
        if (resultado.cor === 'verde') {
            semaforoLuz.classList.add('verde');
        } else if (resultado.cor === 'azul') {
            semaforoLuz.classList.add('azul');
        } else if (resultado.cor === 'amarelo') {
            semaforoLuz.classList.add('amarelo');
        } else {
            semaforoLuz.classList.add('vermelho');
        }

        // Pontuação
        document.getElementById('pontuacaoValor').textContent = resultado.pontuacao;

        // Título e mensagem
        document.getElementById('resultTitle').textContent = resultado.titulo;
        document.getElementById('resultMessage').textContent = resultado.mensagem;

        // Métricas
        document.getElementById('metricKm').textContent = `R$ ${resultado.lucros.porKm.toFixed(2)}`;
        document.getElementById('metricHora').textContent = `R$ ${resultado.lucros.porHora.toFixed(2)}`;
        document.getElementById('metricMin').textContent = `R$ ${resultado.lucros.porMinuto.toFixed(2)}`;

        // Detalhes
        document.getElementById('detalheLucro').textContent = `R$ ${resultado.lucroLiquido.toFixed(2)}`;
        document.getElementById('detalheMargen').textContent = `${resultado.margemLucro.toFixed(1)}%`;
        document.getElementById('detalheCusto').textContent = `R$ ${resultado.custos.total.toFixed(2)}`;
        document.getElementById('detalheCombustivel').textContent = `R$ ${resultado.custos.combustivel.toFixed(2)}`;
        document.getElementById('detalheDesgaste').textContent = `R$ ${resultado.custos.desgaste.toFixed(2)}`;
        
        // Eficiência
        const eficiencia = resultado.distancia > 0 ? 
            `${resultado.lucroLiquido / resultado.distancia} L/Km` : 
            '-';
        document.getElementById('detalheEficiencia').textContent = eficiencia;
        
        // Tempo de retorno
        const tempoRetorno = resultado.valorCorrida > 0 ? 
            `${(resultado.custos.total / resultado.valorCorrida * resultado.tempo).toFixed(0)} min` : 
            '-';
        document.getElementById('detalheRetorno').textContent = tempoRetorno;
    }

    // Botão Nova Análise
    btnNovaAnalise.addEventListener('click', function() {
        // Limpar formulário
        quickValor.value = '';
        quickDistancia.value = '';
        quickTempo.value = '';
        
        // Mostrar formulário e esconder resultado
        document.querySelector('.analise-rapida').style.display = 'block';
        document.querySelector('.stats-today').style.display = 'block';
        resultadoAnalise.style.display = 'none';
        
        // Focar no primeiro input
        quickValor.focus();
        
        // Atualizar estatísticas
        atualizarEstatisticas();
        atualizarHistorico();
    });

    // Botões de Decisão
    btnAcceptCorrida.addEventListener('click', async function() {
        if (ultimaAnalise) {
            // Registrar decisão
            ultimaAnalise.decisao = 'aceita';
            await analisador.salvarHistorico(ultimaAnalise);
            
            // Vibrar feedback positivo
            analisador.vibrar('sucesso');
            
            showToast('Corrida aceita e registrada no histórico!', 'success');
            
            // Nova análise
            btnNovaAnalise.click();
        }
    });

    btnRejectCorrida.addEventListener('click', async function() {
        if (ultimaAnalise) {
            // Registrar decisão
            ultimaAnalise.decisao = 'recusada';
            await analisador.salvarHistorico(ultimaAnalise);
            
            // Vibrar feedback negativo
            analisador.vibrar('erro');
            
            showToast('Corrida recusada e registrada no histórico.', 'info');
            
            // Nova análise
            btnNovaAnalise.click();
        }
    });

    // Atualizar Estatísticas do Dia
    async function atualizarEstatisticas() {
        const hoje = new Date().toISOString().split('T')[0];
        const stats = await analisador.obterEstatisticasPorData(hoje);
        
        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('statAceitas').textContent = stats.aceitas;
        document.getElementById('statRecusadas').textContent = stats.recusadas;
        
        const lucroMedio = stats.total > 0 ? stats.lucroTotal / stats.total : 0;
        document.getElementById('statLucroMedio').textContent = `R$ ${lucroMedio.toFixed(2)}`;
    }

    // Atualizar Histórico Rápido
    async function atualizarHistorico() {
        const historico = await analisador.obterHistorico();
        const listaHistorico = document.getElementById('listaHistoricoRapido');
        
        if (historico.length === 0) {
            listaHistorico.innerHTML = '<p class="text-muted">Nenhuma análise realizada hoje.</p>';
            return;
        }
        
        // Mostrar últimas 5 análises
        const ultimas = historico.slice(0, 5);
        
        listaHistorico.innerHTML = ultimas.map(h => {
            const nomeApp = getNomeApp(h.app);
            const classDecisao = h.decisao === 'aceita' ? 'aceita' : 'recusada';
            const textoDecisao = h.decisao === 'aceita' ? 'Aceita' : 'Recusada';
            
            return `
                <div class="historico-item ${classDecisao}">
                    <div class="historico-info">
                        <div class="historico-app">${nomeApp}</div>
                        <div class="historico-valores">
                            R$ ${h.valorCorrida.toFixed(2)} • ${h.distancia.toFixed(1)} km • ${h.tempo} min
                        </div>
                    </div>
                    <div class="historico-decisao ${classDecisao}">
                        ${textoDecisao}
                    </div>
                </div>
            `;
        }).join('');
    }

    function getNomeApp(app) {
        const nomes = {
            'ifood': '🍔 iFood',
            'uber': '🚗 Uber',
            '99': '💛 99',
            'rappi': '🏍️ Rappi'
        };
        return nomes[app] || app;
    }

    // Modal de Configuração
    btnConfigCriterios.addEventListener('click', async function() {
        const config = await analisador.obterConfiguracao();
        
        document.getElementById('configMinKm').value = config.lucroMinimoPorKm;
        document.getElementById('configMinHora').value = config.lucroMinimoPorHora;
        document.getElementById('configMinMin').value = config.lucroMinimoPorMinuto;
        
        modalCriterios.style.display = 'flex';
    });

    btnFecharModal.addEventListener('click', function() {
        modalCriterios.style.display = 'none';
    });

    btnSalvarCriterios.addEventListener('click', async function() {
        const novaConfig = {
            lucroMinimoPorKm: parseFloat(document.getElementById('configMinKm').value),
            lucroMinimoPorHora: parseFloat(document.getElementById('configMinHora').value),
            lucroMinimoPorMinuto: parseFloat(document.getElementById('configMinMin').value)
        };
        
        await analisador.configurar(novaConfig);
        
        showToast('Configuração salva com sucesso!', 'success');
        modalCriterios.style.display = 'none';
    });

    // Fechar modal ao clicar fora
    modalCriterios.addEventListener('click', function(e) {
        if (e.target === modalCriterios) {
            modalCriterios.style.display = 'none';
        }
    });

    // Inicialização
    async function init() {
        // Atualizar estatísticas ao carregar
        await atualizarEstatisticas();
        await atualizarHistorico();
        
        // Pré-selecionar iFood (app mais comum)
        if (appButtons.length > 0) {
            appButtons[0].click();
        }
    }

    // Executar quando a aba for aberta
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
