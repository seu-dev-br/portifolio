@echo off
chcp 65001 > nul
echo ==========================================
echo 🧪 Testando Workflow com Commit Vazio
echo ==========================================
echo.

echo Este script fará:
echo 1. Um commit vazio (sem alterações)
echo 2. Push para o repositório remoto
echo.
echo Isso acionará o workflow de deploy do GitHub Actions
echo para testar se os segredos foram configurados corretamente.
echo.

echo Deseja continuar? (S/N)
set /p confirma=

if /i "%confirma%" neq "S" (
    echo.
    echo ❌ Operação cancelada.
    pause
    exit /b 1
)

echo.
echo 📝 Criando commit vazio...
git commit --allow-empty -m "Testar workflow após configuração de segredos"
if %errorlevel% neq 0 (
    echo ❌ Erro ao criar commit
    pause
    exit /b 1
)

echo.
echo 🚀 Enviando para o GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Erro ao enviar para o GitHub
    pause
    exit /b 1
)

echo.
echo ✅ Commit vazio enviado com sucesso!
echo.
echo Por favor, verifique a aba "Actions" no GitHub para
echo acompanhar o progresso do workflow:
echo https://github.com/seu-dev-br/portifolio/actions
echo.
pause
