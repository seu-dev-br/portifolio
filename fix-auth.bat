@echo off
echo ========================================
echo 🔐 RESOLVENDO PROBLEMA DE AUTENTICACAO
echo ========================================
echo.

echo 📝 Passo 1: Verificando configuracoes de ambiente...
call node scripts/check-env.js
if %errorlevel% neq 0 (
    echo ❌ Erro: Variaveis de ambiente nao configuradas corretamente!
    echo.
    echo Para resolver:
    echo 1. Certifique-se de que o arquivo .env.local existe
    echo 2. Verifique se SUPABASE_URL e SUPABASE_ANON_KEY estao definidas
    echo.
    pause
    exit /b 1
)

echo.
echo 📝 Passo 2: Tentando criar usuario administrativo...
call node scripts/create-admin-user.js
if %errorlevel% neq 0 (
    echo ❌ Erro ao criar usuario administrativo!
    echo.
    pause
    exit /b 1
)

echo.
echo 📝 Passo 3: Testando autenticacao...
call node scripts/test-admin-login.js
if %errorlevel% neq 0 (
    echo ❌ Erro ao testar autenticacao com o usuario administrador!
    echo.
    pause
    exit /b 1
)

echo.
echo 📝 Passo 4: Testando autenticacao com usuario padrao...
call node test_auth.js
if %errorlevel% neq 0 (
    echo ❌ Erro ao testar autenticacao padrao!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Solucao de autenticacao aplicada!
echo.
echo 📋 Proximos passos manuais:
echo 1. Acesse o painel do Supabase: https://supabase.com/dashboard
echo 2. Selecione o projeto: nattvkjaecceirxthizc
echo 3. Configure as URLs de redirecionamento conforme o arquivo REDIRECT_URLS.md
echo 4. Desabilite a confirmacao de email nas configuracoes de autenticacao
echo.
echo 🔑 Credenciais para teste:
echo - Email: admin@italo.dev
echo - Senha: Italo2025Admin!
echo.
echo Se precisar mais ajuda, consulte o arquivo SUPABASE_AUTH_FIX.md
echo.
pause
