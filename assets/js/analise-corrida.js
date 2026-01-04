// Analisador de Corridas - Motoca BR PRO
// Funcionalidades equivalentes ao DSW
// Versão: 1.3

class AnalisadorCorrida {
    constructor() {
        this.loadConfig();
        this.initVibration();
    }

    loadConfig() {
        // Configurações personalizáveis
        this.config = {
            // Critérios mínimos
            minLucroKm: parseFloat(localStorage.getItem('minLucroKm')) || 2.50,
            minLucroHora: parseFloat(localStorage.getItem('minLucroHora')) || 30.00,
            minLucroMin: parseFloat(localStorage.getItem('minLucroMin')) || 0.50,
            
            // Custos operacionais
            custoDesgasteKm: 0.15, // Manutenção por km
            custoFixoPorCorrida: 0.50, // Fixo por entrega
            
            // Configurações por app
            apps: {
                ifood: {
                    nome: 'iFood',
                    cor: '#ea1d2c',
                    taxaPlataforma: 0.15,
                    tempoMedioKm: 4 // minutos
                },
                uber: {
                    nome: 'Uber Eats',
                    cor: '#000000',
                    taxaPlataforma: 0.25,
                    tempoMedioKm: 3.5
                },
                '99': {
                    nome: '99Food',
                    cor: '#ffd000',
                    taxaPlataforma: 0.20,
                    tempoMedioKm: 4
                },
                rappi: {
                    nome: 'Rappi',
                    cor: '#ff441f',
                    taxaPlataforma: 0.18,
                    tempoMedioKm: 3.8
                }
            }
        };
    }

    initVibration() {
        this.canVibrate = 'vibrate' in navigator;
    }

    vibrar(pattern = [200]) {
        if (this.canVibrate) {
            navigator.vibrate(pattern);
        }
    }

    analisar(dados) {
        const { valor, distancia, tempo, app = 'ifood' } = dados;
        
        // Validações
        if (!valor || !distancia || !tempo) {
            return { erro: 'Preencha todos os campos' };
        }

        // Cálculos detalhados
        const custos = this.calcularCustos(distancia, app);
        const lucros = this.calcularLucros(valor, custos, distancia, tempo);
        const recomendacao = this.gerarRecomendacao(lucros);
        const metricas = this.calcularMetricas(lucros, distancia, tempo);

        // Salvar histórico
        this.salvarHistorico({
            timestamp: Date.now(),
            app,
            valor,
            distancia,
            tempo,
            lucros,
            recomendacao,
            aceita: null // Será atualizado quando usuário decidir
        });

        // Vibrar conforme recomendação
        if (recomendacao.nivel === 'EXCELENTE') {
            this.vibrar([100, 50, 100]); // Vibração positiva
        } else if (recomendacao.nivel === 'RUIM') {
            this.vibrar([300]); // Vibração de alerta
        }

        return {
            custos,
            lucros,
            recomendacao,
            metricas,
            app: this.config.apps[app]
        };
    }

    calcularCustos(distanciaKm, app) {
        // Obter dados do localStorage
        const kmPorLitro = parseFloat(localStorage.getItem('kmPorLitro')) || 35;
        const precoCombustivel = parseFloat(localStorage.getItem('precoPorLitro')) || 5.89;
        
        // Cálculo de combustível
        const litros = distanciaKm / kmPorLitro;
        const combustivel = litros * precoCombustivel;
        
        // Desgaste (pneus, freios, óleo, corrente)
        const desgaste = distanciaKm * this.config.custoDesgasteKm;
        
        // Custo fixo por corrida
        const fixo = this.config.custoFixoPorCorrida;
        
        // Taxa da plataforma (se aplicável)
        const taxaPlataforma = this.config.apps[app]?.taxaPlataforma || 0;
        
        const total = combustivel + desgaste + fixo;
        
        return {
            combustivel: combustivel.toFixed(2),
            desgaste: desgaste.toFixed(2),
            fixo: fixo.toFixed(2),
            total: total.toFixed(2),
            taxaPlataforma: (taxaPlataforma * 100).toFixed(0) + '%'
        };
    }

    calcularLucros(valorPago, custos, distanciaKm, tempoMin) {
        const custoTotal = parseFloat(custos.total);
        const lucroLiquido = valorPago - custoTotal;
        
        // Métricas principais (como DSW)
        const lucroKm = lucroLiquido / distanciaKm;
        const lucroHora = lucroLiquido / (tempoMin / 60);
        const lucroMin = lucroLiquido / tempoMin;
        
        // Margem de lucro percentual
        const margemLucro = (lucroLiquido / valorPago) * 100;
        
        return {
            liquido: lucroLiquido.toFixed(2),
            km: lucroKm.toFixed(2),
            hora: lucroHora.toFixed(2),
            minuto: lucroMin.toFixed(2),
            margemPct: margemLucro.toFixed(1)
        };
    }

    gerarRecomendacao(lucros) {
        const lucroKm = parseFloat(lucros.km);
        const lucroHora = parseFloat(lucros.hora);
        const lucroMin = parseFloat(lucros.minuto);
        
        let nivel, cor, emoji, mensagem, pontuacao;
        
        // Sistema de pontuação (0-100)
        pontuacao = 0;
        if (lucroKm >= this.config.minLucroKm) pontuacao += 35;
        else pontuacao += (lucroKm / this.config.minLucroKm) * 35;
        
        if (lucroHora >= this.config.minLucroHora) pontuacao += 35;
        else pontuacao += (lucroHora / this.config.minLucroHora) * 35;
        
        if (lucroMin >= this.config.minLucroMin) pontuacao += 30;
        else pontuacao += (lucroMin / this.config.minLucroMin) * 30;
        
        pontuacao = Math.min(100, Math.round(pontuacao));
        
        // Definir recomendação baseada na pontuação
        if (pontuacao >= 80) {
            nivel = 'EXCELENTE';
            cor = '#28a745';
            emoji = '🟢';
            mensagem = 'ACEITE AGORA! Corrida muito lucrativa 🚀';
        } else if (pontuacao >= 60) {
            nivel = 'BOA';
            cor = '#17a2b8';
            emoji = '🔵';
            mensagem = 'Corrida boa! Recomendado aceitar ✅';
        } else if (pontuacao >= 40) {
            nivel = 'RAZOÁVEL';
            cor = '#ffc107';
            emoji = '🟡';
            mensagem = 'Corrida OK. Avalie contexto (fila, horário) ⚠️';
        } else {
            nivel = 'RUIM';
            cor = '#dc3545';
            emoji = '🔴';
            mensagem = 'NÃO RECOMENDADO. Lucro muito baixo ❌';
        }
        
        return { nivel, cor, emoji, mensagem, pontuacao };
    }

    calcularMetricas(lucros, distancia, tempo) {
        // Métricas adicionais para análise
        const velocidadeMedia = (distancia / (tempo / 60)).toFixed(1);
        const custoPorMinuto = (parseFloat(lucros.liquido) / tempo * -1).toFixed(2);
        
        return {
            velocidadeMedia: velocidadeMedia + ' km/h',
            eficiencia: this.calcularEficiencia(lucros),
            tempoRetorno: this.calcularTempoRetorno(distancia, tempo)
        };
    }

    calcularEficiencia(lucros) {
        const lucroKm = parseFloat(lucros.km);
        if (lucroKm >= 4) return 'Muito Alta 🔥';
        if (lucroKm >= 3) return 'Alta ⭐';
        if (lucroKm >= 2) return 'Média ✓';
        return 'Baixa ⚠️';
    }

    calcularTempoRetorno(distancia, tempo) {
        // Estima tempo para voltar ao ponto inicial
        const tempoRetorno = tempo * 0.7; // Normalmente mais rápido na volta
        return Math.round(tempoRetorno) + ' min';
    }

    salvarHistorico(analise) {
        try {
            let historico = JSON.parse(localStorage.getItem('historicoAnalises') || '[]');
            
            // Adicionar análise
            historico.unshift(analise); // Adiciona no início
            
            // Limitar a 200 análises
            if (historico.length > 200) {
                historico = historico.slice(0, 200);
            }
            
            localStorage.setItem('historicoAnalises', JSON.stringify(historico));
            
            // Atualizar estatísticas
            this.atualizarEstatisticas(analise);
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao salvar histórico:', e);
        }
    }

    atualizarEstatisticas(analise) {
        try {
            let stats = JSON.parse(localStorage.getItem('estatisticasAnalises') || '{}');
            
            const hoje = new Date().toDateString();
            if (!stats[hoje]) {
                stats[hoje] = {
                    total: 0,
                    aceitas: 0,
                    recusadas: 0,
                    somaLucro: 0,
                    somaDistancia: 0,
                    somaTempo: 0,
                    porApp: {}
                };
            }
            
            stats[hoje].total++;
            stats[hoje].somaLucro += parseFloat(analise.lucros.liquido);
            stats[hoje].somaDistancia += parseFloat(analise.distancia);
            stats[hoje].somaTempo += parseFloat(analise.tempo);
            
            // Por app
            if (!stats[hoje].porApp[analise.app]) {
                stats[hoje].porApp[analise.app] = { total: 0, lucroTotal: 0 };
            }
            stats[hoje].porApp[analise.app].total++;
            stats[hoje].porApp[analise.app].lucroTotal += parseFloat(analise.lucros.liquido);
            
            // Limpar dados antigos (> 90 dias)
            const dataLimite = new Date();
            dataLimite.setDate(dataLimite.getDate() - 90);
            Object.keys(stats).forEach(data => {
                if (new Date(data) < dataLimite) {
                    delete stats[data];
                }
            });
            
            localStorage.setItem('estatisticasAnalises', JSON.stringify(stats));
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao atualizar estatísticas:', e);
        }
    }

    registrarDecisao(timestamp, aceita) {
        try {
            let historico = JSON.parse(localStorage.getItem('historicoAnalises') || '[]');
            const analise = historico.find(a => a.timestamp === timestamp);
            
            if (analise) {
                analise.aceita = aceita;
                localStorage.setItem('historicoAnalises', JSON.stringify(historico));
                
                // Atualizar estatísticas
                let stats = JSON.parse(localStorage.getItem('estatisticasAnalises') || '{}');
                const hoje = new Date().toDateString();
                if (stats[hoje]) {
                    if (aceita) {
                        stats[hoje].aceitas++;
                    } else {
                        stats[hoje].recusadas++;
                    }
                    localStorage.setItem('estatisticasAnalises', JSON.stringify(stats));
                }
            }
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao registrar decisão:', e);
        }
    }

    obterEstatisticasHoje() {
        try {
            const stats = JSON.parse(localStorage.getItem('estatisticasAnalises') || '{}');
            const hoje = new Date().toDateString();
            
            if (!stats[hoje]) {
                return {
                    total: 0,
                    aceitas: 0,
                    recusadas: 0,
                    lucroMedio: 0,
                    kmTotal: 0,
                    tempoTotal: 0
                };
            }
            
            const s = stats[hoje];
            return {
                total: s.total,
                aceitas: s.aceitas || 0,
                recusadas: s.recusadas || 0,
                lucroMedio: s.total > 0 ? (s.somaLucro / s.total).toFixed(2) : 0,
                kmTotal: s.somaDistancia.toFixed(1),
                tempoTotal: Math.round(s.somaTempo)
            };
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao obter estatísticas:', e);
            return null;
        }
    }

    configurarCriterios(novosMinimos) {
        // Permite usuário personalizar critérios
        if (novosMinimos.minLucroKm) {
            this.config.minLucroKm = novosMinimos.minLucroKm;
            localStorage.setItem('minLucroKm', novosMinimos.minLucroKm);
        }
        if (novosMinimos.minLucroHora) {
            this.config.minLucroHora = novosMinimos.minLucroHora;
            localStorage.setItem('minLucroHora', novosMinimos.minLucroHora);
        }
        if (novosMinimos.minLucroMin) {
            this.config.minLucroMin = novosMinimos.minLucroMin;
            localStorage.setItem('minLucroMin', novosMinimos.minLucroMin);
        }
    }

    obterConfiguracao() {
        // Retorna a configuração atual dos critérios mínimos
        return {
            lucroMinimoPorKm: this.config.minLucroKm,
            lucroMinimoPorHora: this.config.minLucroHora,
            lucroMinimoPorMinuto: this.config.minLucroMin,
            kmPorLitro: this.config.kmPorLitro,
            precoPorLitro: this.config.precoPorLitro
        };
    }

    obterEstatisticasPorData(dataStr) {
        // Retorna estatísticas de um dia específico
        try {
            const stats = JSON.parse(localStorage.getItem('estatisticasAnalises') || '{}');
            const dataKey = new Date(dataStr).toDateString();
            
            if (!stats[dataKey]) {
                return {
                    total: 0,
                    aceitas: 0,
                    recusadas: 0,
                    lucroTotal: 0,
                    kmTotal: 0,
                    tempoTotal: 0
                };
            }
            
            const s = stats[dataKey];
            return {
                total: s.total,
                aceitas: s.aceitas || 0,
                recusadas: s.recusadas || 0,
                lucroTotal: s.somaLucro || 0,
                kmTotal: s.somaDistancia || 0,
                tempoTotal: s.somaTempo || 0
            };
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao obter estatísticas por data:', e);
            return {
                total: 0,
                aceitas: 0,
                recusadas: 0,
                lucroTotal: 0,
                kmTotal: 0,
                tempoTotal: 0
            };
        }
    }

    /**
     * Obtém o histórico completo de análises
     * @returns {Array} Array de análises do histórico
     */
    obterHistorico() {
        try {
            const historico = localStorage.getItem('historico_analises');
            if (!historico) {
                return [];
            }
            
            const dados = JSON.parse(historico);
            
            // Retorna array de análises, ordenadas por data (mais recente primeiro)
            if (Array.isArray(dados)) {
                return dados.sort((a, b) => {
                    const dataA = new Date(a.timestamp || a.data);
                    const dataB = new Date(b.timestamp || b.data);
                    return dataB - dataA;
                });
            }
            
            return [];
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao obter histórico:', e);
            return [];
        }
    }

    /**
     * Limpa o histórico de análises
     */
    limparHistorico() {
        try {
            localStorage.removeItem('historico_analises');
            console.log('[AnalisadorCorrida] Histórico limpo com sucesso');
            return true;
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao limpar histórico:', e);
            return false;
        }
    }

    /**
     * Exporta o histórico como JSON
     * @returns {string} JSON string do histórico
     */
    exportarHistorico() {
        try {
            const historico = this.obterHistorico();
            return JSON.stringify(historico, null, 2);
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao exportar histórico:', e);
            return '[]';
        }
    }

    /**
     * Configura os critérios mínimos de análise
     * @param {Object} criterios - Objeto com os critérios (minPorKm, minPorHora, minPorMin ou lucroMinimoPorKm, lucroMinimoPorHora, lucroMinimoPorMinuto)
     */
    configurar(criterios) {
        try {
            // Aceita ambos os formatos de nomenclatura
            if (criterios.minPorKm !== undefined || criterios.lucroMinimoPorKm !== undefined) {
                this.minPorKm = Number(criterios.minPorKm || criterios.lucroMinimoPorKm);
            }
            if (criterios.minPorHora !== undefined || criterios.lucroMinimoPorHora !== undefined) {
                this.minPorHora = Number(criterios.minPorHora || criterios.lucroMinimoPorHora);
            }
            if (criterios.minPorMin !== undefined || criterios.lucroMinimoPorMinuto !== undefined) {
                this.minPorMin = Number(criterios.minPorMin || criterios.lucroMinimoPorMinuto);
            }

            // Salva no localStorage
            const config = {
                minPorKm: this.minPorKm,
                minPorHora: this.minPorHora,
                minPorMin: this.minPorMin
            };
            localStorage.setItem('criterios_analise', JSON.stringify(config));
            
            console.log('[AnalisadorCorrida] Critérios configurados:', config);
            return true;
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao configurar critérios:', e);
            return false;
        }
    }

    /**
     * Obtém a configuração atual de critérios
     * @returns {Object} Objeto com os critérios atuais
     */
    obterConfiguracao() {
        return {
            lucroMinimoPorKm: this.minPorKm,
            lucroMinimoPorHora: this.minPorHora,
            lucroMinimoPorMinuto: this.minPorMin,
            // Aliases para compatibilidade
            minPorKm: this.minPorKm,
            minPorHora: this.minPorHora,
            minPorMin: this.minPorMin
        };
    }

    /**
     * Carrega os critérios salvos do localStorage
     */
    carregarCriterios() {
        try {
            const config = localStorage.getItem('criterios_analise');
            if (config) {
                const criterios = JSON.parse(config);
                this.configurar(criterios);
                console.log('[AnalisadorCorrida] Critérios carregados:', criterios);
            }
        } catch (e) {
            console.error('[AnalisadorCorrida] Erro ao carregar critérios:', e);
        }
    }
}

// Instância global
const analisador = new AnalisadorCorrida();

// Carrega critérios salvos na inicialização
analisador.carregarCriterios();
