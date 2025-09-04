@echo off
chcp 65001 > nul
echo ========================================
echo 🚀 ENVIANDO PROJETO PARA O GITHUB
echo ========================================
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não encontrado! Instale o Git antes de continuar.
    pause
    exit /b 1
)

echo ✅ Git encontrado
echo.

REM Configurar finais de linha para previnir problemas LF/CRLF
echo 📝 Configurando finais de linha...
git config core.autocrlf false
git config core.safecrlf false

REM Verificar se .gitattributes existe e adicioná-lo ao staging
if exist .gitattributes (
    echo ✅ Usando arquivo .gitattributes existente
    git add .gitattributes
) else (
    echo ❌ Arquivo .gitattributes não encontrado
)

REM Verificar status atual
echo 📋 Verificando status atual do repositório...
git status
echo.

REM Adicionar arquivos novos e modificados, exceto .env
echo 📋 Adicionando arquivos ao commit (exceto arquivos sensíveis)...
git add .
git reset -- .env* >nul 2>&1
echo ✅ Arquivos .env foram excluídos do commit

REM Verificar se deseja adicionar .env.example
echo.
echo Deseja incluir o arquivo .env.example? (S/N)
echo ATENÇÃO: Verifique se ele não contém credenciais reais!
set /p adicionar_env_example=

if /i "%adicionar_env_example%"=="S" (
    git add .env.example
    echo ✅ Arquivo .env.example adicionado ao commit
)

REM Criar mensagem de commit
echo.
echo 📝 Digite uma mensagem descritiva para o commit:
echo (Exemplo: "Atualização da autenticação e configuração do deploy")
set /p commit_msg=

if "%commit_msg%"=="" (
    set commit_msg=Atualização do projeto Astro+Supabase
)

REM Realizar commit
echo.
echo 📋 Criando commit...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ❌ Erro ao criar commit
    pause
    exit /b 1
)

REM Verificar branch atual
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set branch=%%a
echo.
echo 📋 Branch atual: %branch%

REM Perguntar se deseja enviar para o GitHub
echo.
echo Deseja enviar as alterações para o GitHub? (S/N)
set /p enviar=

if /i "%enviar%"=="S" (
    echo.
    echo 📋 Enviando para o GitHub...
    git push origin %branch%
    if %errorlevel% neq 0 (
        echo ❌ Erro ao enviar para o GitHub
        echo.
        echo Possíveis causas:
        echo 1. Problemas de conexão com a Internet
        echo 2. Permissões insuficientes no repositório
        echo 3. Conflitos no repositório remoto
        echo.
        echo Resolva o problema e tente novamente com 'git push origin %branch%'
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ Alterações enviadas com sucesso para o GitHub!
    echo 🌐 Repositório: seu-dev-br/portifolio
    echo 🔄 Branch: %branch%
) else (
    echo.
    echo ℹ️ As alterações foram salvas localmente mas não foram enviadas para o GitHub.
    echo Para enviar mais tarde, use o comando:
    echo git push origin %branch%
)

echo.
echo ✅ Processo concluído!
pause
