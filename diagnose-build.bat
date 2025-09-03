@echo off
echo 🚀 Iniciando build com diagnóstico completo...
echo.

REM Verificar Node.js
echo 📋 Verificando ambiente:
node --version
npm --version
echo.

REM Limpar cache e dist
echo 🧹 Limpando cache e dist...
if exist dist rmdir /s /q dist
if exist node_modules\.astro rmdir /s /q node_modules\.astro
npm run astro -- sync
echo.

REM Executar build com logs detalhados
echo 🏗️  Executando build...
set NODE_OPTIONS=--trace-warnings
npx astro build --verbose --debug > build.log 2>&1

REM Verificar resultado
if exist dist (
    echo ✅ Build concluído! Verificando arquivos...
    dir dist /b
) else (
    echo ❌ Build falhou! Verificando logs...
    if exist build.log (
        echo.
        echo 📄 Últimas linhas do log:
        tail -20 build.log
    )
)

echo.
echo 🎯 Diagnóstico concluído.
