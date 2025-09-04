@echo off
chcp 65001 > nul
echo =============================================
echo 🔐 Configuração de Segredos para GitHub Actions
echo =============================================
echo.
echo Este script ajudará você a configurar os segredos
echo necessários para o deploy automático na Vercel.
echo.

REM Verificar se o gh CLI está instalado
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI (gh) não encontrado!
    echo.
    echo Para usar este script, você precisa instalar o GitHub CLI:
    echo https://cli.github.com/
    echo.
    echo Após instalar, faça login com:
    echo   gh auth login
    echo.
    pause
    exit /b 1
)

REM Verificar se está logado
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Você não está autenticado no GitHub CLI!
    echo.
    echo Por favor, faça login primeiro:
    echo   gh auth login
    echo.
    pause
    exit /b 1
)

echo ✅ GitHub CLI encontrado e autenticado
echo.

REM Coletar informações da Vercel
echo === Informações da Vercel ===
echo.
echo Por favor, forneça seu token da Vercel:
echo (Você pode obter isso em: https://vercel.com/account/tokens)
set /p VERCEL_TOKEN="Token da Vercel: "

echo.
echo Por favor, forneça o ID da sua organização na Vercel:
echo (Você pode encontrar isso em: Settings -> General do seu projeto)
set /p VERCEL_ORG_ID="ID da Organização: "

echo.
echo Por favor, forneça o ID do seu projeto na Vercel:
echo (Você pode encontrar isso em: Settings -> General do seu projeto)
set /p VERCEL_PROJECT_ID="ID do Projeto: "

REM Coletar informações do Supabase
echo.
echo === Informações do Supabase ===
echo.
echo Por favor, forneça a URL do seu projeto no Supabase:
echo (Você pode encontrar isso em: Settings -> API)
set /p SUPABASE_URL="URL do Supabase: "

echo.
echo Por favor, forneça a chave anônima do seu projeto no Supabase:
echo (Você pode encontrar isso em: Settings -> API -> anon/public key)
set /p SUPABASE_ANON_KEY="Chave Anônima: "

REM Confirmar os valores
echo.
echo === Confirmação ===
echo.
echo Por favor, confirme que os valores abaixo estão corretos:
echo.
echo VERCEL_TOKEN: %VERCEL_TOKEN:~0,4%***************
echo VERCEL_ORG_ID: %VERCEL_ORG_ID:~0,4%***************
echo VERCEL_PROJECT_ID: %VERCEL_PROJECT_ID:~0,4%***************
echo SUPABASE_URL: %SUPABASE_URL%
echo SUPABASE_ANON_KEY: %SUPABASE_ANON_KEY:~0,4%***************
echo.
echo Os valores estão corretos? (S/N)
set /p CONFIRMA=

if /i "%CONFIRMA%" neq "S" (
    echo.
    echo ❌ Operação cancelada pelo usuário.
    echo Por favor, execute o script novamente.
    pause
    exit /b 1
)

REM Adicionar os segredos ao GitHub
echo.
echo === Adicionando Segredos ao GitHub ===
echo.

echo 1/5: Adicionando VERCEL_TOKEN...
gh secret set VERCEL_TOKEN --body="%VERCEL_TOKEN%"
if %errorlevel% neq 0 (
    echo ❌ Erro ao adicionar VERCEL_TOKEN
    pause
    exit /b 1
)

echo 2/5: Adicionando VERCEL_ORG_ID...
gh secret set VERCEL_ORG_ID --body="%VERCEL_ORG_ID%"
if %errorlevel% neq 0 (
    echo ❌ Erro ao adicionar VERCEL_ORG_ID
    pause
    exit /b 1
)

echo 3/5: Adicionando VERCEL_PROJECT_ID...
gh secret set VERCEL_PROJECT_ID --body="%VERCEL_PROJECT_ID%"
if %errorlevel% neq 0 (
    echo ❌ Erro ao adicionar VERCEL_PROJECT_ID
    pause
    exit /b 1
)

echo 4/5: Adicionando SUPABASE_URL...
gh secret set SUPABASE_URL --body="%SUPABASE_URL%"
if %errorlevel% neq 0 (
    echo ❌ Erro ao adicionar SUPABASE_URL
    pause
    exit /b 1
)

echo 5/5: Adicionando SUPABASE_ANON_KEY...
gh secret set SUPABASE_ANON_KEY --body="%SUPABASE_ANON_KEY%"
if %errorlevel% neq 0 (
    echo ❌ Erro ao adicionar SUPABASE_ANON_KEY
    pause
    exit /b 1
)

echo.
echo ✅ Todos os segredos foram adicionados com sucesso!
echo.
echo Para testar o workflow, você pode criar um commit vazio:
echo   git commit --allow-empty -m "Testar workflow após configuração de segredos"
echo   git push origin main
echo.
echo Verifique o status do workflow na aba "Actions" do GitHub.
echo.
pause
