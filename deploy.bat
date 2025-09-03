@echo off
echo ========================================
echo 🚀 DEPLOY - PORTFOLIO ASTRO + SUPABASE
echo ========================================
echo.

echo 📦 Passo 1: Instalando dependências...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo.
echo 🔨 Passo 2: Executando build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)

echo.
echo ✅ Build concluído com sucesso!
echo.
echo 📁 Arquivos prontos na pasta: dist/
echo.
echo 🌐 Próximos passos:
echo 1. Faça upload de todos os arquivos da pasta dist/
echo 2. Configure as variáveis de ambiente no seu provedor
echo 3. Acesse seu site!
echo.
echo 🔧 Variáveis necessárias:
echo SUPABASE_URL=https://nattvkjaecceirxthizc.supabase.co
echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
echo.
echo 📚 Ver DEPLOY.md para instruções detalhadas
echo.
pause
