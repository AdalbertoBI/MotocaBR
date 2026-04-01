/**
 * analise-corrida.js — Analisador de Corridas do Motoca BR
 * Versão: 2.0 — usa IndexedDB via MotocaDB (db.js) em vez do localStorage.
 */

class AnalisadorCorrida {
    constructor() {
        // Configurações carregadas de forma síncrona com valores padrão;
        // serão sobreescritas ao chamar loadConfig() de forma assíncrona.
        this.config = {
            minLucroKm:   2.50,
            minLucroHora: 30.00,
            minLucroMin:  0.50,
            custoDesgasteKm:    0.15,
            custoFixoPorCorrida: 0.50,
            apps: {
                ifood: { nome: 'iFood',     cor: '#ea1d2c', taxaPlataforma: 0.15, tempoMedioKm: 4   },
                uber:  { nome: 'Uber Eats', cor: '#000000', taxaPlataforma: 0.25, tempoMedioKm: 3.5 },
                '99':  { nome: '99Food',    cor: '#ffd000', taxaPlataforma: 0.20, tempoMedioKm: 4   },
                rappi: { nome: 'Rappi',     cor: '#ff441f', taxaPlataforma: 0.18, tempoMedioKm: 3.8 },
            },
        };
        this.canVibrate = 'vibrate' in navigator;
    }

    // ── carregamento assíncrono de configurações ──────────────────────────────

    async loadConfig() {
        const km   = await MotocaDB.getConfigFloat('minLucroKm',   2.50);
        const hora = await MotocaDB.getConfigFloat('minLucroHora', 30.00);
        const min  = await MotocaDB.getConfigFloat('minLucroMin',  0.50);

        this.config.minLucroKm   = km;
        this.config.minLucroHora = hora;
        this.config.minLucroMin  = min;
    }

    // ── vibração ──────────────────────────────────────────────────────────────

    vibrar(pattern = [200]) {
        if (this.canVibrate) navigator.vibrate(pattern);
    }

    // ── análise principal ─────────────────────────────────────────────────────

    async analisar(dados) {
        const { valor, distancia, tempo, app = 'ifood' } = dados;

        if (!valor || !distancia || !tempo) {
            return { erro: 'Preencha todos os campos' };
        }

        const custos       = await this.calcularCustos(distancia, app);
        const lucros       = this.calcularLucros(valor, custos, distancia, tempo);
        const recomendacao = this.gerarRecomendacao(lucros);
        const metricas     = this.calcularMetricas(lucros, distancia, tempo);

        await this.salvarHistorico({
            timestamp: Date.now(),
            app,
            valor,
            distancia,
            tempo,
            lucros,
            recomendacao,
            aceita: null,
        });

        if (recomendacao.nivel === 'EXCELENTE') {
            this.vibrar([100, 50, 100]);
        } else if (recomendacao.nivel === 'RUIM') {
            this.vibrar([300]);
        }

        return { custos, lucros, recomendacao, metricas, app: this.config.apps[app] };
    }

    // ── cálculos ──────────────────────────────────────────────────────────────

    async calcularCustos(distanciaKm, app) {
        const kmPorLitro       = await MotocaDB.getConfigFloat('kmPorLitro',   35);
        const precoCombustivel = await MotocaDB.getConfigFloat('precoPorLitro', 5.89);

        const litros    = distanciaKm / kmPorLitro;
        const combustivel = litros * precoCombustivel;
        const desgaste  = distanciaKm * this.config.custoDesgasteKm;
        const fixo      = this.config.custoFixoPorCorrida;
        const total     = combustivel + desgaste + fixo;
        const taxaPlat  = this.config.apps[app]?.taxaPlataforma || 0;

        return {
            combustivel:   combustivel.toFixed(2),
            desgaste:      desgaste.toFixed(2),
            fixo:          fixo.toFixed(2),
            total:         total.toFixed(2),
            taxaPlataforma: (taxaPlat * 100).toFixed(0) + '%',
        };
    }

    calcularLucros(valorPago, custos, distanciaKm, tempoMin) {
        const custoTotal   = parseFloat(custos.total);
        const lucroLiquido = valorPago - custoTotal;

        return {
            liquido:    lucroLiquido.toFixed(2),
            km:         (lucroLiquido / distanciaKm).toFixed(2),
            hora:       (lucroLiquido / (tempoMin / 60)).toFixed(2),
            minuto:     (lucroLiquido / tempoMin).toFixed(2),
            margemPct:  ((lucroLiquido / valorPago) * 100).toFixed(1),
        };
    }

    gerarRecomendacao(lucros) {
        const lucroKm   = parseFloat(lucros.km);
        const lucroHora = parseFloat(lucros.hora);
        const lucroMin  = parseFloat(lucros.minuto);

        let pontuacao = 0;
        pontuacao += lucroKm   >= this.config.minLucroKm   ? 35 : (lucroKm   / this.config.minLucroKm)   * 35;
        pontuacao += lucroHora >= this.config.minLucroHora ? 35 : (lucroHora / this.config.minLucroHora) * 35;
        pontuacao += lucroMin  >= this.config.minLucroMin  ? 30 : (lucroMin  / this.config.minLucroMin)  * 30;
        pontuacao = Math.min(100, Math.round(pontuacao));

        if (pontuacao >= 80) {
            return { nivel: 'EXCELENTE', cor: '#28a745', emoji: '🟢', mensagem: 'ACEITE AGORA! Corrida muito lucrativa 🚀', pontuacao };
        } else if (pontuacao >= 60) {
            return { nivel: 'BOA',      cor: '#17a2b8', emoji: '🔵', mensagem: 'Corrida boa! Recomendado aceitar ✅', pontuacao };
        } else if (pontuacao >= 40) {
            return { nivel: 'RAZOÁVEL', cor: '#ffc107', emoji: '🟡', mensagem: 'Corrida OK. Avalie contexto (fila, horário) ⚠️', pontuacao };
        } else {
            return { nivel: 'RUIM',     cor: '#dc3545', emoji: '🔴', mensagem: 'NÃO RECOMENDADO. Lucro muito baixo ❌', pontuacao };
        }
    }

    calcularMetricas(lucros, distancia, tempo) {
        return {
            velocidadeMedia: (distancia / (tempo / 60)).toFixed(1) + ' km/h',
            eficiencia:      this._calcularEficiencia(lucros),
            tempoRetorno:    Math.round(tempo * 0.7) + ' min',
        };
    }

    _calcularEficiencia(lucros) {
        const lucroKm = parseFloat(lucros.km);
        if (lucroKm >= 4) return 'Muito Alta 🔥';
        if (lucroKm >= 3) return 'Alta ⭐';
        if (lucroKm >= 2) return 'Média ✓';
        return 'Baixa ⚠️';
    }

    // ── histórico ─────────────────────────────────────────────────────────────

    async salvarHistorico(analise) {
        try {
            await MotocaDB.addAnalise(analise);
            await this.atualizarEstatisticas(analise);
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao salvar histórico:', e);
        }
    }

    async atualizarEstatisticas(analise) {
        try {
            const hoje    = new Date().toDateString();
            let   stats   = await MotocaDB.getEstatisticasByDateKey(hoje) || {
                dateKey:       hoje,
                total:         0,
                aceitas:       0,
                recusadas:     0,
                somaLucro:     0,
                somaDistancia: 0,
                somaTempo:     0,
                porApp:        {},
            };

            stats.total++;
            stats.somaLucro     += parseFloat(analise.lucros.liquido);
            stats.somaDistancia += parseFloat(analise.distancia);
            stats.somaTempo     += parseFloat(analise.tempo);

            if (!stats.porApp[analise.app]) {
                stats.porApp[analise.app] = { total: 0, lucroTotal: 0 };
            }
            stats.porApp[analise.app].total++;
            stats.porApp[analise.app].lucroTotal += parseFloat(analise.lucros.liquido);

            await MotocaDB.putEstatisticas(hoje, stats);

            // Limpar estatísticas antigas (> 90 dias) de forma assíncrona
            MotocaDB.limparEstatisticasAntigas(90);
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao atualizar estatísticas:', e);
        }
    }

    async registrarDecisao(timestamp, aceita) {
        try {
            const historico = await MotocaDB.getHistoricoAnalises(1000);
            const analise   = historico.find(a => a.timestamp === timestamp);
            if (!analise) return;

            await MotocaDB.updateAnaliseDecisao(analise.id, aceita);

            // Atualizar contadores de aceitas/recusadas
            const hoje  = new Date().toDateString();
            const stats = await MotocaDB.getEstatisticasByDateKey(hoje);
            if (stats) {
                if (aceita) stats.aceitas++;
                else        stats.recusadas++;
                await MotocaDB.putEstatisticas(hoje, stats);
            }
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao registrar decisão:', e);
        }
    }

    async obterEstatisticasHoje() {
        try {
            const hoje  = new Date().toDateString();
            const stats = await MotocaDB.getEstatisticasByDateKey(hoje);

            if (!stats) {
                return { total: 0, aceitas: 0, recusadas: 0, lucroMedio: 0, kmTotal: 0, tempoTotal: 0 };
            }

            return {
                total:     stats.total,
                aceitas:   stats.aceitas   || 0,
                recusadas: stats.recusadas || 0,
                lucroMedio: stats.total > 0 ? (stats.somaLucro / stats.total).toFixed(2) : 0,
                kmTotal:   (stats.somaDistancia || 0).toFixed(1),
                tempoTotal: Math.round(stats.somaTempo || 0),
            };
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao obter estatísticas:', e);
            return null;
        }
    }

    async obterEstatisticasPorData(dataStr) {
        try {
            const dateKey = new Date(dataStr).toDateString();
            const stats   = await MotocaDB.getEstatisticasByDateKey(dateKey);
            if (!stats) {
                return { total: 0, aceitas: 0, recusadas: 0, lucroTotal: 0, kmTotal: 0, tempoTotal: 0 };
            }
            return {
                total:     stats.total,
                aceitas:   stats.aceitas   || 0,
                recusadas: stats.recusadas || 0,
                lucroTotal:  stats.somaLucro     || 0,
                kmTotal:     stats.somaDistancia || 0,
                tempoTotal:  stats.somaTempo     || 0,
            };
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao obter estatísticas por data:', e);
            return { total: 0, aceitas: 0, recusadas: 0, lucroTotal: 0, kmTotal: 0, tempoTotal: 0 };
        }
    }

    async obterHistorico(limite = 200) {
        try {
            return await MotocaDB.getHistoricoAnalises(limite);
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao obter histórico:', e);
            return [];
        }
    }

    async limparHistorico() {
        try {
            await MotocaDB.clearHistoricoAnalises();
            console.log('[AnalisadorCorrida] Histórico limpo.');
            return true;
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao limpar histórico:', e);
            return false;
        }
    }

    async exportarHistorico() {
        try {
            const historico = await this.obterHistorico();
            return JSON.stringify(historico, null, 2);
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao exportar histórico:', e);
            return '[]';
        }
    }

    // ── configuração de critérios ─────────────────────────────────────────────

    async configurarCriterios(novosMinimos) {
        if (novosMinimos.minLucroKm !== undefined) {
            this.config.minLucroKm = novosMinimos.minLucroKm;
            await MotocaDB.setConfig('minLucroKm', novosMinimos.minLucroKm);
        }
        if (novosMinimos.minLucroHora !== undefined) {
            this.config.minLucroHora = novosMinimos.minLucroHora;
            await MotocaDB.setConfig('minLucroHora', novosMinimos.minLucroHora);
        }
        if (novosMinimos.minLucroMin !== undefined) {
            this.config.minLucroMin = novosMinimos.minLucroMin;
            await MotocaDB.setConfig('minLucroMin', novosMinimos.minLucroMin);
        }
    }

    // Alias compatível com analise-ui.js
    async configurar(criterios) {
        const mapeado = {};
        if (criterios.minPorKm     !== undefined) mapeado.minLucroKm   = Number(criterios.minPorKm);
        if (criterios.minPorHora   !== undefined) mapeado.minLucroHora = Number(criterios.minPorHora);
        if (criterios.minPorMin    !== undefined) mapeado.minLucroMin  = Number(criterios.minPorMin);
        if (criterios.lucroMinimoPorKm      !== undefined) mapeado.minLucroKm   = Number(criterios.lucroMinimoPorKm);
        if (criterios.lucroMinimoPorHora    !== undefined) mapeado.minLucroHora = Number(criterios.lucroMinimoPorHora);
        if (criterios.lucroMinimoPorMinuto  !== undefined) mapeado.minLucroMin  = Number(criterios.lucroMinimoPorMinuto);
        await this.configurarCriterios(mapeado);
    }

    async obterConfiguracao() {
        await this.loadConfig();
        return {
            lucroMinimoPorKm:      this.config.minLucroKm,
            lucroMinimoPorHora:    this.config.minLucroHora,
            lucroMinimoPorMinuto:  this.config.minLucroMin,
            minPorKm:   this.config.minLucroKm,
            minPorHora: this.config.minLucroHora,
            minPorMin:  this.config.minLucroMin,
        };
    }

    async carregarCriterios() {
        await this.loadConfig();
        console.log('[AnalisadorCorrida] Critérios carregados do IndexedDB.');
    }
}

// ── instância global ──────────────────────────────────────────────────────────

const analisador = new AnalisadorCorrida();

// Carrega critérios salvos assim que o banco estiver pronto
MotocaDB.init().then(() => analisador.carregarCriterios()).catch(e => {
    console.error('[AnalisadorCorrida] Erro ao inicializar com IndexedDB:', e);
});
