@echo off
echo ========================================
echo 🚀 SIMULAÇÃO DE DEPLOY NA VERCEL
echo ========================================
echo.

echo 📋 Etapa 1: Verificando ambiente
echo ------------------------------
echo.

REM Verificar Node.js
echo 🔍 Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    pause
    exit /b 1
)

REM Verificar NPM
echo 🔍 Verificando NPM...
npm --version
if %errorlevel% neq 0 (
    echo ❌ NPM não encontrado!
    pause
    exit /b 1
)

REM Verificar Vercel CLI
echo 🔍 Verificando Vercel CLI...
npx vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Vercel CLI não encontrado
    echo ℹ️ Isso é apenas uma simulação, então não vamos instalar o Vercel CLI
) else (
    echo ✅ Vercel CLI encontrado
)

echo.
echo 📋 Etapa 2: Verificando variáveis de ambiente
echo -----------------------------------------
echo.

echo 🔍 Verificando variáveis do Supabase...
node scripts/check-env.js
if %errorlevel% neq 0 (
    echo ❌ Erro nas variáveis de ambiente
    pause
    exit /b 1
)

echo.
echo 📋 Etapa 3: Executando build
echo ------------------------
echo.

echo 🏗️ Executando build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build!
    pause
    exit /b 1
)

echo.
echo 📋 Etapa 4: Verificando arquivos gerados
echo -----------------------------------
echo.

echo 🔍 Verificando pasta dist...
if not exist dist (
    echo ❌ Pasta dist não encontrada!
    pause
    exit /b 1
)

echo ✅ Pasta dist encontrada
echo.

echo 🔍 Conteúdo da pasta dist:
dir dist /b
echo.

echo 🔍 Verificando arquivos principais...
if not exist dist\index.html (
    echo ❌ Arquivo index.html não encontrado!
    pause
    exit /b 1
)

echo ✅ Arquivo index.html encontrado
echo.

echo 📋 Etapa 5: Simulando deploy na Vercel
echo ----------------------------------
echo.

echo 🔧 Verificando arquivo vercel.json...
if not exist vercel.json (
    echo ⚠️ Arquivo vercel.json não encontrado!
    echo Este arquivo é importante para configuração do deploy na Vercel
) else (
    echo ✅ Arquivo vercel.json encontrado
)

echo.
echo 🔄 Simulando processo de deploy na Vercel...
echo ℹ️ Em um deploy real, a Vercel faria:
echo  1. Configuração do projeto
echo  2. Instalação de dependências
echo  3. Execução do build (npm run build)
echo  4. Implantação dos arquivos da pasta dist/
echo  5. Configuração do domínio e variáveis de ambiente
echo.

echo 🌐 Configurações que seriam aplicadas na Vercel:
echo  - Build Command: npm run build
echo  - Output Directory: dist
echo  - Framework Preset: Astro
echo  - Node.js Version: ^18.0.0
echo.

echo ✅ SIMULAÇÃO DE DEPLOY CONCLUÍDA COM SUCESSO!
echo.
echo 📝 Em um deploy real na Vercel:
echo  1. Seu site estaria disponível em: https://portifolio-seu-dev-br.vercel.app
echo  2. As variáveis de ambiente do Supabase estariam configuradas
echo  3. Os redirecionamentos do arquivo vercel.json seriam aplicados
echo.
echo 🚀 Para realizar um deploy real na Vercel:
echo  1. Instale o Vercel CLI: npm i -g vercel
echo  2. Execute: vercel login
echo  3. Execute: npm run deploy:vercel
echo.
echo 📘 Para mais informações, consulte o arquivo DEPLOY.md
echo.
pause
