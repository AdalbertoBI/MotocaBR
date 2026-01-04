# 📱 Guia de Geração do APK - Motoca BR

## Método 1: PWABuilder (Recomendado - Mais Fácil)

### Passos:

1. **Acesse PWABuilder**
   - https://www.pwabuilder.com/

2. **Digite a URL do seu PWA**
   ```
   https://adalbertobi.github.io/MotocaBR/
   ```

3. **Clique em "Start"**

4. **Espere a análise**
   - PWABuilder vai testar seu PWA

5. **Clique em "Package for Stores"**

6. **Selecione "Android"**

7. **Configure opções:**
   - Package ID: `br.motoca.app`
   - App Name: `Motoca BR`
   - Version: `1.0.0`
   - Signing Key: Deixe gerar automaticamente

8. **Clique em "Generate"**

9. **Baixe o APK**
   - Arquivo `.apk` estará pronto
   - Também receberá `.aab` para Google Play

10. **Teste no celular**
    - Transfira APK para o celular
    - Ative "Instalar apps desconhecidos"
    - Instale o APK

---

## Método 2: Bubblewrap (Via Terminal)

### Pré-requisitos:
```bash
# Node.js instalado
node --version

# Java JDK instalado
java -version

# Android SDK instalado
```

### Instalação:
```bash
npm install -g @bubblewrap/cli
```

### Gerar APK:
```bash
# Inicializar projeto
bubblewrap init --manifest=https://adalbertobi.github.io/MotocaBR/manifest.json

# Build APK
bubblewrap build

# APK estará em: app-release-signed.apk
```

---

## Método 3: Capacitor (Mais Avançado)

### 1. Instalar Capacitor:
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### 2. Inicializar:
```bash
npx cap init "Motoca BR" br.motoca.app --web-dir=.
npx cap add android
```

### 3. Copiar assets:
```bash
npx cap copy android
npx cap sync android
```

### 4. Abrir Android Studio:
```bash
npx cap open android
```

### 5. Build no Android Studio:
- Build → Generate Signed Bundle / APK
- Selecione APK
- Siga o wizard de assinatura

---

## Método 4: GitHub Actions (Automático)

Crie `.github/workflows/build-apk.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: 18
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        java-version: 17
        distribution: 'temurin'
    
    - name: Install Bubblewrap
      run: npm install -g @bubblewrap/cli
    
    - name: Build APK
      run: |
        bubblewrap init --manifest=https://adalbertobi.github.io/MotocaBR/manifest.json
        bubblewrap build
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: motoca-br-apk
        path: app-release-signed.apk
```

---

## 🎯 Recomendação

**Use PWABuilder primeiro!**
- Mais simples
- Não precisa instalar nada
- Gera APK em minutos
- Ideal para teste inicial

**Depois migre para Capacitor se precisar:**
- Recursos nativos avançados
- Plugins personalizados
- Maior controle

---

## 📦 Distribuição

### GitHub Releases:
1. Criar release no GitHub
2. Anexar APK
3. Usuários baixam direto

### Firebase Hosting + App Distribution:
```bash
firebase hosting:channel:deploy apk-download
```

### Página de Download no GitHub Pages:
- Adicione botão de download
- Instruções de instalação
- Vídeo tutorial

---

## 🔐 Assinatura do APK

### Gerar Keystore:
```bash
keytool -genkey -v -keystore motoca-br.keystore -alias motocabr -keyalg RSA -keysize 2048 -validity 10000
```

### Guardar com segurança:
- Nunca commitar no Git
- Usar GitHub Secrets para CI/CD
- Backup em local seguro

---

## 📱 Instalação no Celular

### Via USB (ADB):
```bash
adb install motoca-br.apk
```

### Via QR Code:
1. Upload APK para servidor
2. Gerar QR Code com URL
3. Usuário escaneia e baixa

### Via Link Direto:
```html
<a href="motoca-br.apk" download>Baixar Motoca BR</a>
```

---

## ✅ Checklist Pré-Build

- [ ] manifest.json configurado
- [ ] Ícones em todos tamanhos
- [ ] Service Worker funcionando
- [ ] HTTPS ativo (GitHub Pages)
- [ ] Testado no navegador móvel
- [ ] Screenshots preparados
- [ ] Descrição atualizada

---

## 🚀 Próximos Passos

1. Gere APK com PWABuilder
2. Teste no celular
3. Se funcionar bem, publique no GitHub Releases
4. Considere Google Play Store (requer conta de desenvolvedor - $25)
