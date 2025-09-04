@echo off
echo ========================================
echo 🚀 SIMULAÇÃO DE DEPLOY
echo ========================================
echo.

echo 📋 Passo 1: Executando build...
call build.bat
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)

echo.
echo 📋 Passo 2: Preparando ambiente para preview...
echo.

REM Verifica se o comando http-server está disponível
npx --no-install http-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Instalando http-server...
    npm install -g http-server
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar http-server
        pause
        exit /b 1
    )
)

echo.
echo 🔍 Verificando conteúdo da pasta dist...
dir dist /b

echo.
echo 🌐 Iniciando servidor de preview na porta 8080...
echo ⚠️ Pressione Ctrl+C para encerrar o servidor quando terminar
echo.
echo 🔗 Acesse: http://localhost:8080
echo.
cd dist && http-server -o -c-1
