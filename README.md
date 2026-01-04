# 🏍️ Motoca BR - Sistema Completo para Motoboys

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-success)](https://adalbertobi.github.io/MotocaBR/)
[![Version](https://img.shields.io/badge/version-3.2-blue)](https://github.com/AdalbertoBI/MotocaBR/releases)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://adalbertobi.github.io/MotocaBR/)
[![Android APK](https://img.shields.io/badge/Android-APK%20Available-brightgreen)](https://github.com/AdalbertoBI/MotocaBR/releases/latest)

> Sistema completo de gestão para motoboys com análise de corridas, cálculo de fretes, gestão financeira e otimização de rotas.

## 🚀 Acesso Rápido

- **🌐 Web App (PWA):** [https://adalbertobi.github.io/MotocaBR/](https://adalbertobi.github.io/MotocaBR/)
- **📱 Android APK:** [Download Latest Release](https://github.com/AdalbertoBI/MotocaBR/releases/latest)
- **📚 Documentação:** [Ver Docs](./docs/)

---

## ✨ Funcionalidades

### 🚦 Análise de Corrida Inteligente
- Análise em tempo real de propostas de corrida
- Semáforo visual (Verde/Amarelo/Vermelho)
- Cálculo automático de lucro considerando:
  - Distância total
  - Tempo estimado
  - Custos operacionais (combustível, manutenção)
  - Valor oferecido pelo app
- Estatísticas diárias e históricas
- Suporte para múltiplos apps: iFood, Uber, 99, Rappi

### 🗺️ Otimização de Rotas
- Integração com Leaflet Maps
- Visualização de múltiplos pontos
- Cálculo de rota otimizada
- Estimativa de tempo e distância
- Suporte offline com cache de mapas

### 💰 Cálculo de Frete
- Cálculo preciso baseado em distância
- Taxas personalizáveis
- Histórico de fretes
- Múltiplas tabelas de preços

### 📊 Gestão Financeira
- Controle de receitas e despesas
- Categorização automática
- Relatórios detalhados
- Gráficos de desempenho
- Export de dados

---

## 📁 Estrutura do Projeto

```
MotocaBR/
├── assets/
│   ├── css/
│   │   ├── style.css              # Estilos principais
│   │   └── analise-style.css      # Estilos da análise
│   ├── js/
│   │   ├── script.js              # Lógica principal
│   │   ├── mapa.js                # Gestão de mapas
│   │   ├── frete.js               # Cálculo de fretes
│   │   ├── financeiro.js          # Gestão financeira
│   │   ├── analise-corrida.js     # Engine de análise
│   │   ├── analise-ui.js          # Interface de análise
│   │   ├── install-prompt.js      # Prompt instalação PWA
│   │   ├── update-checker.js      # Verificador de updates
│   │   └── apk-installer.js       # Sistema instalação APK
│   └── libs/
│       └── bubbly-bg.min.js       # Background animado
├── img/                           # Ícones e imagens
├── database/                      # Estruturas de dados
├── backend/                       # Lógica backend
├── prototypes/                    # Protótipos e testes
├── docs/                          # Documentação completa
│   ├── PACKAGE-ANALYSIS.md        # Análise do pacote Android
│   ├── RELEASE-GUIDE.md           # Guia de releases
│   ├── IMPLEMENTATION-GUIDE.md    # Guia de implementação
│   ├── TRANSFORMATION-GUIDE.md    # Guia de transformação
│   └── build-apk.md               # Como gerar APK
├── .github/
│   └── workflows/
│       └── build-apk.yml          # CI/CD GitHub Actions
├── .well-known/
│   └── assetlinks.json            # Asset Links para TWA
├── index.html                     # Página principal
├── manifest.json                  # Manifest PWA
├── sw.js                          # Service Worker
├── robots.txt                     # SEO
├── sitemap.xml                    # SEO
└── .gitignore                     # Arquivos ignorados

```

---

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Grid/Flexbox
- **JavaScript (ES6+)** - Lógica e interatividade
- **Leaflet.js** - Mapas interativos
- **Bubbly Background** - Animações

### PWA (Progressive Web App)
- **Service Worker** - Cache e offline
- **Web App Manifest** - Instalação nativa
- **LocalStorage API** - Persistência de dados
- **Geolocation API** - Localização do usuário

### Android
- **TWA (Trusted Web Activity)** - App nativo
- **Bubblewrap CLI** - Geração de APK
- **Asset Links** - Validação de domínio

### DevOps
- **GitHub Pages** - Hospedagem
- **GitHub Actions** - CI/CD
- **Git** - Controle de versão

---

## 📱 Instalação

### Opção 1: PWA (Recomendado para todos)

1. Acesse: [https://adalbertobi.github.io/MotocaBR/](https://adalbertobi.github.io/MotocaBR/)
2. Clique no ícone de **"Instalar"** no navegador
3. Confirme a instalação
4. O app será adicionado à sua tela inicial

**Vantagens:**
- ✅ Instalação instantânea
- ✅ Atualizações automáticas
- ✅ Funciona offline
- ✅ Compatível com Android, iOS, Windows, Mac, Linux

### Opção 2: APK Android (Nativo)

1. Acesse: [Releases](https://github.com/AdalbertoBI/MotocaBR/releases/latest)
2. Baixe o arquivo **MotocaBR.apk**
3. Permita instalação de fontes desconhecidas (se necessário)
4. Instale o APK
5. Abra o app

**Vantagens:**
- ✅ App 100% nativo para Android
- ✅ Melhor integração com sistema
- ✅ Notificações nativas
- ✅ Atualizações automáticas do conteúdo (via TWA)

**Detecção Automática:**
O sistema detecta automaticamente dispositivos Android compatíveis e oferece o download do APK quando apropriado!

---

## 🚀 Como Usar

### 1️⃣ Análise de Corrida

1. Selecione o app (iFood, Uber, 99, Rappi)
2. Insira o valor da corrida
3. Insira a distância total
4. Insira o tempo estimado
5. Clique em **"ANALISAR AGORA"**
6. Veja o resultado no semáforo:
   - 🟢 **Verde:** Aceitar (lucro ótimo)
   - 🟡 **Amarelo:** Avaliar (lucro médio)
   - 🔴 **Vermelho:** Recusar (prejuízo)

### 2️⃣ Otimização de Rotas

1. Adicione pontos de coleta/entrega
2. Visualize no mapa
3. Sistema calcula rota otimizada
4. Veja tempo e distância estimados

### 3️⃣ Cálculo de Frete

1. Insira origem e destino
2. Defina distância
3. Sistema calcula valor justo
4. Salve no histórico

### 4️⃣ Gestão Financeira

1. Registre receitas (corridas)
2. Registre despesas (combustível, manutenção)
3. Visualize relatórios
4. Acompanhe lucro líquido

---

## ⚙️ Configuração

### Custos Operacionais

Ajuste os custos padrão em **Análise → Configurações**:

- **Combustível:** R$/km
- **Manutenção:** R$/km
- **Tempo mínimo:** valor/hora
- **Distância mínima aceitável:** km
- **Lucro mínimo:** R$

---

## 🔄 Atualizações

### PWA
- ✅ Atualiza automaticamente via Service Worker
- ✅ Notificação quando nova versão disponível
- ✅ Sem necessidade de reinstalação

### APK (TWA)
- ✅ Carrega automaticamente versão web mais recente
- ✅ Sem necessidade de republicar APK
- ✅ Basta atualizar o site no GitHub Pages

### Verificação Manual
O app verifica atualizações a cada 24h automaticamente. Para forçar verificação:
1. Acesse **Configurações**
2. Clique em **"Verificar Atualizações"**

---

## 🏗️ Desenvolvimento

### Pré-requisitos
```bash
# Git
git --version

# Node.js (opcional, para ferramentas)
node --version

# Servidor HTTP local (para testes)
python -m http.server 8000
# ou
npx http-server
```

### Clone e Execute
```bash
# Clone o repositório
git clone https://github.com/AdalbertoBI/MotocaBR.git
cd MotocaBR

# Abra no navegador
# Opção 1: Abrir index.html diretamente
start index.html

# Opção 2: Servidor local (recomendado)
python -m http.server 8000
# Acesse: http://localhost:8000
```

### Estrutura de Branches
- `main` - Produção (GitHub Pages)
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções

### Workflow de Desenvolvimento
```bash
# Criar nova feature
git checkout -b feature/minha-feature

# Fazer commits
git add .
git commit -m "feat: Nova funcionalidade"

# Enviar para GitHub
git push origin feature/minha-feature

# Criar Pull Request no GitHub
```

---

## 📦 Build e Deploy

### Deploy Automático (GitHub Pages)
Qualquer commit na branch `main` dispara deploy automático via GitHub Actions.

### Build Manual de APK
Ver guia completo: [docs/build-apk.md](./docs/build-apk.md)

```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Gerar APK
bubblewrap init --manifest https://adalbertobi.github.io/MotocaBR/manifest.json
bubblewrap build

# APK gerado: app-release-signed.apk
```

### CI/CD GitHub Actions
O workflow `.github/workflows/build-apk.yml` automatiza:
- ✅ Validação de código
- ✅ Testes automatizados
- ✅ Geração de documentação
- ✅ Criação de releases

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Diretrizes
- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize documentação quando necessário
- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 Licença

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Adalberto BI**
- GitHub: [@AdalbertoBI](https://github.com/AdalbertoBI)
- Projeto: [MotocaBR](https://github.com/AdalbertoBI/MotocaBR)

---

## 🙏 Agradecimentos

- [Leaflet](https://leafletjs.com/) - Mapas interativos
- [PWABuilder](https://www.pwabuilder.com/) - Ferramentas PWA
- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) - Geração de TWA
- Comunidade de motoboys brasileiros

---

## 📊 Status do Projeto

- ✅ MVP Completo
- ✅ PWA Funcional
- ✅ APK Android Disponível
- ✅ Sistema de Análise Implementado
- ✅ Otimização de Rotas
- ✅ Gestão Financeira
- 🚧 Integração com APIs de apps (em andamento)
- 🚧 Notificações push (planejado)
- 🚧 Modo escuro completo (planejado)

---

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/AdalbertoBI/MotocaBR/issues/new)

---

## 💡 Sugestões

Tem uma ideia? [Abra uma discussão](https://github.com/AdalbertoBI/MotocaBR/discussions/new)

---

## ⭐ Mostre seu Apoio

Se este projeto te ajudou, deixe uma ⭐ no repositório!

---

**Made with ❤️ for motoboys brasileiros 🏍️🇧🇷**
