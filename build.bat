@echo off
echo 🚀 Iniciando build completo do projeto...
echo.

REM Verificar se Node.js está disponível
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    exit /b 1
)

REM Verificar se npm está disponível
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado!
    exit /b 1
)

echo ✅ Node.js e npm encontrados
echo.

REM Executar verificação de ambiente
echo 🔍 Verificando variáveis de ambiente...
node scripts/check-env.js
if errorlevel 1 (
    echo ❌ Falha na verificação de ambiente
    exit /b 1
)

echo ✅ Verificação de ambiente OK
echo.

REM Executar build do Astro
echo 🏗️  Executando build do Astro...
npx astro build
if errorlevel 1 (
    echo ❌ Falha no build do Astro
    echo Código de erro: %errorlevel%
    exit /b 1
)

echo ✅ Build concluído com sucesso!
echo 📁 Arquivos gerados na pasta dist/
