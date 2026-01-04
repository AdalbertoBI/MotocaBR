# 📱 Guia de Releases e Atualizações - Motoca BR

## 🔄 Como Funciona a Atualização

### PWA (Web) - Automático ✅
- Push no GitHub → Deploy automático
- Service Worker atualiza cache
- Usuários recebem update ao recarregar

### APK (Nativo) - Manual ❌
- Precisa gerar novo APK
- Precisa criar release no GitHub
- Usuários precisam baixar e instalar

---

## 🚀 Processo de Release

### 1️⃣ Atualizar Versão nos Arquivos

**Service Worker (`sw.js`):**
```javascript
const CACHE_NAME = 'motoca-br-v3.2'; // Incrementar
```

**Update Checker (`update-checker.js`):**
```javascript
const APP_VERSION = '3.2'; // Incrementar
```

**Manifest (`manifest.json`):**
```json
{
  "version": "3.2",
  "version_name": "3.2 - Análise de Corridas"
}
```

### 2️⃣ Fazer Commit com Tag

```bash
# Commit normal
git add .
git commit -m "release: v3.2 - Descrição das mudanças"

# Criar tag
git tag -a v3.2 -m "Versão 3.2 - Análise de Corridas e Sistema de Atualização"

# Push com tag
git push origin main --tags
```

### 3️⃣ Gerar APK

**Opção A - PWABuilder (Mais Simples):**
1. Acesse https://www.pwabuilder.com/
2. Cole: `https://adalbertobi.github.io/MotocaBR/`
3. Clique em "Start"
4. Package For Stores → Android
5. Baixe o APK gerado

**Opção B - Bubblewrap CLI:**
```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Inicializar (primeira vez)
bubblewrap init --manifest https://adalbertobi.github.io/MotocaBR/manifest.json

# Build APK
bubblewrap build

# Assinar APK (necessário)
bubblewrap build --skipPwaValidation
```

**Opção C - GitHub Actions (Automático):**
- Já configurado em `.github/workflows/build-apk.yml`
- Push com tag `v*` gera APK automaticamente
- APK é anexado ao release

### 4️⃣ Criar Release no GitHub

**Via GitHub Web:**
1. Acesse: https://github.com/AdalbertoBI/MotocaBR/releases
2. Clique em "Draft a new release"
3. Escolha a tag criada (v3.2)
4. Título: "Motoca BR v3.2 - Análise de Corridas"
5. Descrição:
```markdown
## 🆕 Novidades

- 🚦 Sistema de análise de corridas em tempo real
- 📊 Estatísticas e histórico de análises
- 📱 Sistema de notificação de atualizações
- 🎨 Interface otimizada para toque

## 📥 Download

### Android (APK)
Baixe o arquivo `motocabr-v3.2.apk` abaixo e instale no seu dispositivo.

### Web (PWA)
Acesse: https://adalbertobi.github.io/MotocaBR/

## 🔧 Correções

- Fix: Métodos faltantes no analisador
- Fix: Cache do Service Worker

## 📖 Documentação

Veja o [guia completo](https://github.com/AdalbertoBI/MotocaBR/blob/main/IMPLEMENTATION-GUIDE.md)
```

6. Anexe o APK gerado (arrastar arquivo)
7. Marque como "Latest release"
8. Clique em "Publish release"

**Via GitHub CLI:**
```bash
# Upload APK e criar release
gh release create v3.2 \
  motocabr-v3.2.apk \
  --title "Motoca BR v3.2 - Análise de Corridas" \
  --notes "Ver changelog no README.md"
```

### 5️⃣ Notificar Usuários

**O app automaticamente:**
- Verifica atualizações a cada 24h
- Mostra notificação quando disponível
- Oferece download direto do APK

**Manualmente:**
- Postar no WhatsApp da comunidade
- Postar no Instagram
- Avisar no README do GitHub

---

## 🔢 Versionamento Semântico

Usar formato: `MAJOR.MINOR.PATCH`

### MAJOR (X.0.0) - Mudanças incompatíveis
- Reestruturação completa
- Mudanças que quebram compatibilidade
- Exemplo: v2.0.0 → v3.0.0

### MINOR (x.Y.0) - Novas funcionalidades
- Novos recursos
- Melhorias significativas
- Compatível com versão anterior
- Exemplo: v3.1.0 → v3.2.0

### PATCH (x.y.Z) - Correções de bugs
- Bugfixes
- Pequenas melhorias
- Sem novos recursos
- Exemplo: v3.2.0 → v3.2.1

---

## 📦 Distribuição do APK

### Opção 1: GitHub Releases (Atual)
✅ Grátis
✅ Controle total
❌ Usuário precisa baixar manualmente
❌ Sem atualizações automáticas

**URL do Release:**
```
https://github.com/AdalbertoBI/MotocaBR/releases/latest
```

### Opção 2: Google Play Store (Recomendado)
✅ Atualizações automáticas
✅ Credibilidade
✅ Descoberta de usuários
❌ Taxa única de $25 USD
❌ Processo de revisão (1-3 dias)

**Passos:**
1. Criar conta Google Play Developer
2. Pagar taxa única de $25
3. Criar novo app
4. Upload do APK assinado
5. Preencher informações (screenshots, descrição)
6. Submeter para revisão

### Opção 3: F-Droid (Open Source)
✅ Grátis
✅ Para apps open source
✅ Comunidade confia
❌ Processo lento (semanas)
❌ Menor alcance

### Opção 4: Distribuição Direta
✅ Controle total
✅ Sem custos
✅ Sem restrições
❌ Usuário precisa habilitar "Fontes Desconhecidas"
❌ Sem atualizações automáticas

---

## 🔐 Assinatura do APK

### Criar Keystore (Primeira Vez):
```bash
keytool -genkey -v \
  -keystore motocabr.keystore \
  -alias motocabr \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**IMPORTANTE:**
- ⚠️ **Guarde a keystore em local seguro!**
- ⚠️ **Não perca a senha!**
- ⚠️ **Não commite no GitHub!**
- ⚠️ Mesma keystore para todas as versões

### Adicionar no `.gitignore`:
```
*.keystore
*.jks
key.properties
```

---

## 🤖 Automação com GitHub Actions

### Configurar Secrets:
No GitHub: Settings → Secrets → Actions

**Adicionar:**
- `KEYSTORE_BASE64`: Keystore em base64
- `KEYSTORE_PASSWORD`: Senha da keystore
- `KEY_ALIAS`: Alias da chave
- `KEY_PASSWORD`: Senha da chave

**Converter keystore para base64:**
```bash
base64 motocabr.keystore > keystore.b64
```

### Workflow Automático:
Já configurado em `.github/workflows/build-apk.yml`

**Gatilho:**
- Push em `main` → Build APK
- Push com tag `v*` → Build APK + Release

---

## 📊 Checklist de Release

### Antes do Release:
- [ ] Incrementar versão em `sw.js`
- [ ] Incrementar versão em `update-checker.js`
- [ ] Atualizar `manifest.json` com versão
- [ ] Testar todas as funcionalidades
- [ ] Verificar erros no console
- [ ] Testar em Android/iOS
- [ ] Atualizar CHANGELOG.md

### Durante o Release:
- [ ] Commit com mensagem clara
- [ ] Criar tag semântica (v3.2.0)
- [ ] Push com `--tags`
- [ ] Gerar APK (PWABuilder ou Bubblewrap)
- [ ] Criar release no GitHub
- [ ] Anexar APK ao release

### Depois do Release:
- [ ] Verificar GitHub Pages deploy
- [ ] Testar versão web atualizada
- [ ] Baixar e testar APK
- [ ] Postar em redes sociais
- [ ] Avisar comunidade WhatsApp

---

## 🐛 Troubleshooting

### APK não instala
- Verificar assinatura válida
- Habilitar "Fontes Desconhecidas"
- Desinstalar versão antiga primeiro

### Atualização não detectada
- Verificar `APP_VERSION` em `update-checker.js`
- Limpar localStorage: `localStorage.clear()`
- Verificar console para erros

### Service Worker não atualiza
- Desregistrar SW: `navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))`
- Limpar cache: Ctrl+Shift+Delete
- Hard reload: Ctrl+Shift+R

---

## 📞 Suporte

Dúvidas sobre releases?
- 💬 [Comunidade WhatsApp](https://chat.whatsapp.com/IbsOuFuyRweCEzLMooCyVD)
- 💻 [GitHub Issues](https://github.com/AdalbertoBI/MotocaBR/issues)
- 📸 [Instagram @betomotoquinha](https://www.instagram.com/betomotoquinha/)

---

**Última atualização:** Janeiro 2026  
**Versão deste guia:** 1.0
