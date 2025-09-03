@echo off
echo Iniciando build do projeto...

REM Executar verificação de ambiente
node scripts/check-env.js

REM Se a verificação foi bem-sucedida, executar o build do Astro
if %errorlevel% equ 0 (
    echo.
    echo Executando build do Astro...
    npx astro build
) else (
    echo.
    echo ❌ Verificação de ambiente falhou!
    exit /b 1
)

echo.
echo ✅ Build concluído com sucesso!
