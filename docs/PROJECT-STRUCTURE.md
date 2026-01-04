# 📋 Estrutura do Projeto - Referência Rápida

## 🎯 Visão Geral

O projeto foi reorganizado em **versão 3.2** com estrutura profissional e escalável.

---

## 📁 Diretórios Principais

### `/assets/` - Recursos Estáticos
Todos os recursos front-end organizados por tipo.

#### `/assets/css/` - Estilos
```
assets/css/
├── style.css              # Estilos principais do app
└── analise-style.css      # Estilos específicos da análise
```

**Quando modificar:**
- Mudanças visuais gerais → `style.css`
- Mudanças na tela de análise → `analise-style.css`

#### `/assets/js/` - Scripts
```
assets/js/
├── script.js              # Lógica principal (tabs, tema, etc)
├── mapa.js                # Gestão de mapas Leaflet
├── frete.js               # Cálculo de fretes
├── financeiro.js          # Gestão financeira
├── analise-corrida.js     # Engine de análise (v1.1)
├── analise-ui.js          # Interface de análise
├── install-prompt.js      # Prompt PWA
├── update-checker.js      # Verificador de updates
└── apk-installer.js       # Sistema de instalação APK (NOVO v3.2)
```

**Ordem de carregamento no `index.html`:**
1. Leaflet (CDN)
2. mapa.js
3. script.js
4. frete.js
5. financeiro.js
6. analise-corrida.js
7. analise-ui.js
8. install-prompt.js
9. update-checker.js
10. apk-installer.js
11. bubbly-bg.min.js

#### `/assets/libs/` - Bibliotecas Externas
```
assets/libs/
└── bubbly-bg.min.js       # Biblioteca de background animado
```

**Para adicionar nova lib:**
1. Baixe o arquivo minificado
2. Coloque em `assets/libs/`
3. Adicione `<script src="assets/libs/nome.js"></script>` no HTML
4. Adicione ao cache do Service Worker

---

### `/img/` - Imagens e Ícones
```
img/
├── icon-192x192.png       # Ícone PWA 192px
├── icon-512x512.png       # Ícone PWA 512px
└── ...                    # Outros ícones/imagens
```

**Formatos aceitos:**
- PNG (preferível para ícones)
- JPG (fotos/backgrounds)
- SVG (vetores)

---

### `/docs/` - Documentação
```
docs/
├── PACKAGE-ANALYSIS.md         # Análise do pacote Android
├── RELEASE-GUIDE.md            # Guia de releases
├── IMPLEMENTATION-GUIDE.md     # Guia de implementação
├── TRANSFORMATION_GUIDE.md     # Guia de transformação
├── build-apk.md                # Como gerar APK
├── download.html               # Página de download (legacy)
├── manifest-new.json           # Manifest alternativo
└── twaBuildConfig.json         # Config Bubblewrap
```

**Quando criar nova doc:**
- Adicione em `/docs/`
- Use formato Markdown (`.md`)
- Atualize referências no README.md

---

### `/.well-known/` - Web Standards
```
.well-known/
└── assetlinks.json        # Asset Links para TWA Android
```

**⚠️ CRÍTICO:** Este arquivo valida o app Android com o domínio web.
**Não modificar** sem entender implicações!

---

### `/.github/` - GitHub Workflows
```
.github/
└── workflows/
    └── build-apk.yml      # CI/CD para build de APK
```

**Workflow automatiza:**
- Build do projeto
- Geração de documentação
- Criação de issues em releases
- Upload de artifacts

---

## 📄 Arquivos Raiz

### Arquivos Principais

#### `index.html`
- **Função:** Página principal do app
- **Versão:** 3.2
- **Modificações comuns:**
  - Adicionar novas abas/seções
  - Atualizar versões de scripts
  - Adicionar meta tags

#### `manifest.json`
- **Função:** Configuração PWA
- **Campos importantes:**
  - `name`: Nome do app
  - `short_name`: Nome curto (ícone)
  - `start_url`: URL inicial
  - `theme_color`: Cor tema
  - `icons`: Ícones do app

#### `sw.js` (Service Worker)
- **Função:** Cache e offline
- **Versão:** v3.2
- **⚠️ DEVE FICAR NA RAIZ** (limitação do navegador)
- **Ao atualizar:**
  1. Incrementar `CACHE_NAME` (ex: v3.2 → v3.3)
  2. Atualizar `FILES_TO_CACHE` se novos arquivos
  3. Testar offline após deploy

### Arquivos de Configuração

#### `.gitignore`
```
# Arquivos sensíveis
signing.keystore
signing-key-info.txt
*.keystore
*.jks

# Builds
*.apk
*.aab
*package.zip

# Node
node_modules/
```

#### `robots.txt`
- **Função:** SEO - Controla crawlers
- **Modificar:** Apenas se souber o que está fazendo

#### `sitemap.xml`
- **Função:** SEO - Mapa do site
- **Atualizar:** Quando adicionar novas páginas

---

## 🔄 Fluxo de Trabalho

### Adicionar Nova Funcionalidade

1. **Criar arquivo JS:**
   ```bash
   # Criar em assets/js/
   touch assets/js/minha-feature.js
   ```

2. **Adicionar ao HTML:**
   ```html
   <script src="assets/js/minha-feature.js?v=1.0"></script>
   ```

3. **Adicionar ao Service Worker:**
   ```javascript
   const FILES_TO_CACHE = [
       // ... outros arquivos
       '/assets/js/minha-feature.js',
   ];
   ```

4. **Incrementar versão do cache:**
   ```javascript
   const CACHE_NAME = 'motoca-br-v3.3'; // 3.2 → 3.3
   ```

5. **Commit e push:**
   ```bash
   git add .
   git commit -m "feat: Adiciona nova funcionalidade X"
   git push origin main
   ```

### Modificar Estilos

1. **Editar CSS apropriado:**
   - Geral → `assets/css/style.css`
   - Análise → `assets/css/analise-style.css`

2. **Incrementar versão no HTML:**
   ```html
   <link rel="stylesheet" href="assets/css/style.css?v=3.3">
   ```

3. **Testar no navegador** (Ctrl+F5 para limpar cache)

4. **Commit e push**

### Atualizar Documentação

1. **Editar markdown em `/docs/`:**
   ```bash
   code docs/NOME-DO-DOC.md
   ```

2. **Adicionar referência no README se necessário**

3. **Commit:**
   ```bash
   git add docs/
   git commit -m "docs: Atualiza documentação X"
   git push
   ```

---

## 🚀 Deploy

### Automático (GitHub Pages)
- **Trigger:** Qualquer push na branch `main`
- **URL:** https://adalbertobi.github.io/MotocaBR/
- **Tempo:** 1-3 minutos após push

### Validar Deploy
```bash
# Após push, aguarde e acesse:
# https://adalbertobi.github.io/MotocaBR/

# Ou verifique status:
# https://github.com/AdalbertoBI/MotocaBR/actions
```

---

## 🔍 Debugging

### Service Worker
```javascript
// No console do navegador:
navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(reg => reg.unregister()));
// Depois: Ctrl+F5 para recarregar
```

### Cache
```javascript
// Limpar cache:
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
});
```

### LocalStorage
```javascript
// Ver dados:
console.log(localStorage);

// Limpar:
localStorage.clear();
```

---

## 📊 Versionamento

### Convenção Semver
- **v3.2.0** = MAJOR.MINOR.PATCH
  - **MAJOR:** Mudanças incompatíveis (v3 → v4)
  - **MINOR:** Novas funcionalidades (v3.2 → v3.3)
  - **PATCH:** Correções de bugs (v3.2.0 → v3.2.1)

### Onde atualizar versão:
1. ✅ `sw.js` → `CACHE_NAME`
2. ✅ Tags de script/css no HTML
3. ✅ `manifest.json` → `version`
4. ✅ README.md → Badge de versão
5. ✅ Git tag → `git tag v3.3`

---

## 🆘 Troubleshooting

### Problema: Mudanças não aparecem
**Solução:**
1. Incrementar versão do Service Worker
2. Ctrl+F5 no navegador
3. Verificar console por erros

### Problema: Arquivos 404
**Solução:**
1. Verificar caminhos relativos (começam sem `/`)
2. Confirmar arquivo existe em `assets/js/` ou `assets/css/`
3. Verificar deploy no GitHub Pages

### Problema: App offline não funciona
**Solução:**
1. Verificar `sw.js` tem todos os arquivos em `FILES_TO_CACHE`
2. Testar em aba anônima
3. Verificar Application → Service Workers no DevTools

---

## 📝 Checklist de Mudanças

Antes de commitar mudanças importantes:

- [ ] Atualizar versão do Service Worker
- [ ] Adicionar novos arquivos ao cache
- [ ] Incrementar tags de versão em scripts
- [ ] Testar offline (DevTools → Network → Offline)
- [ ] Testar em dispositivo móvel
- [ ] Atualizar documentação relevante
- [ ] Verificar console por erros
- [ ] Commit com mensagem descritiva
- [ ] Push e verificar GitHub Actions

---

## 🔗 Links Úteis

- **GitHub Repo:** https://github.com/AdalbertoBI/MotocaBR
- **GitHub Pages:** https://adalbertobi.github.io/MotocaBR/
- **GitHub Actions:** https://github.com/AdalbertoBI/MotocaBR/actions
- **Releases:** https://github.com/AdalbertoBI/MotocaBR/releases

---

**Última atualização:** v3.2 (Janeiro 2026)
**Responsável:** AdalbertoBI
