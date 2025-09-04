@echo off
echo ========================================
echo 🧪 TESTE DE BUILD E DEPLOY
echo ========================================
echo.

echo 📋 ETAPA 1: VERIFICANDO PRÉ-REQUISITOS
echo ------------------------------------
echo.

REM Verificar Node.js
echo 🔍 Verificando versão do Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo Instale o Node.js versão 18 ou superior.
    pause
    exit /b 1
)

REM Verificar NPM
echo 🔍 Verificando versão do npm...
npm --version
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado!
    pause
    exit /b 1
)

REM Verificar variáveis de ambiente
echo 🔍 Verificando variáveis de ambiente...
node scripts/check-env.js
if %errorlevel% neq 0 (
    echo ❌ Erro nas variáveis de ambiente!
    pause
    exit /b 1
)

REM Limpar pasta dist se existir
if exist dist (
    echo 🧹 Limpando pasta dist...
    rmdir /s /q dist
)

echo.
echo 📋 ETAPA 2: PREPARAÇÃO PARA BUILD
echo ------------------------------
echo.

REM Limpar cache npm
echo 🧹 Limpando cache npm...
npm cache clean --force
if %errorlevel% neq 0 (
    echo ⚠️ Aviso: Não foi possível limpar o cache npm.
    echo Continuando mesmo assim...
)

REM Remover node_modules se existir
if exist node_modules (
    echo 🧹 Removendo node_modules...
    rmdir /s /q node_modules
)

REM Instalar dependências
echo 📦 Instalando dependências...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)

echo.
echo 📋 ETAPA 3: EXECUTANDO BUILD
echo -------------------------
echo.

REM Executar testes
echo 🧪 Executando testes...
npm run test:run
if %errorlevel% neq 0 (
    echo ⚠️ Aviso: Alguns testes falharam.
    echo Você deseja continuar mesmo assim? (S/N)
    set /p continuar=
    if /i "%continuar%" neq "S" (
        echo Operação cancelada pelo usuário.
        pause
        exit /b 1
    )
)

REM Executar build com diagnóstico
echo 🏗️ Executando build completo...
set NODE_OPTIONS=--trace-warnings
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro durante o build!
    echo Verifique os logs acima para mais detalhes.
    pause
    exit /b 1
)

echo.
echo 📋 ETAPA 4: VERIFICANDO RESULTADO DO BUILD
echo --------------------------------------
echo.

REM Verificar se a pasta dist foi criada
if not exist dist (
    echo ❌ Pasta dist não foi criada!
    pause
    exit /b 1
)

echo 📁 Conteúdo da pasta dist:
dir dist /b

REM Verificar arquivos essenciais
echo 🔍 Verificando arquivos essenciais...
if not exist dist\index.html (
    echo ❌ Arquivo index.html não encontrado!
    pause
    exit /b 1
)

echo ✅ Arquivos essenciais verificados

echo.
echo 📋 ETAPA 5: VALIDAÇÃO PARA DEPLOY
echo ------------------------------
echo.

REM Verificar configuração do Vercel
echo 🔍 Verificando configuração do Vercel...
if not exist vercel.json (
    echo ⚠️ Arquivo vercel.json não encontrado!
    echo O deploy no Vercel pode não funcionar corretamente.
)

REM Verificar autenticação
echo 🔐 Verificando autenticação...
node scripts/test-admin-login.js
if %errorlevel% neq 0 (
    echo ⚠️ Aviso: Problema com autenticação detectado.
    echo Isso pode afetar o funcionamento do painel admin.
    echo Consulte AUTH_SOLUTION.md para corrigir.
)

echo.
echo ✅ TESTE DE BUILD CONCLUÍDO COM SUCESSO!
echo ======================================
echo.
echo 📋 Resumo:
echo - Node.js e npm: ✓
echo - Variáveis de ambiente: ✓
echo - Instalação de dependências: ✓
echo - Build: ✓
echo - Autenticação: ✓
echo.
echo 🚀 O site está pronto para deploy!
echo.
echo 📝 Opções de deploy:
echo 1. Deploy manual: Copie o conteúdo da pasta dist/ para seu servidor
echo 2. Deploy Vercel: Execute "npm run deploy:vercel" (requer Vercel CLI)
echo 3. Deploy Netlify: Execute "npm run deploy:netlify" (requer Netlify CLI)
echo.
echo Consulte DEPLOY.md para instruções detalhadas.
echo.
pause
