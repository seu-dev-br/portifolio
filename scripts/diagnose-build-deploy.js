// Script para diagnosticar problemas de build e deploy
// Este script analisa o ambiente e as configurações para identificar possíveis problemas

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

// Configuração inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Carregar variáveis de ambiente
config({ path: path.join(rootDir, '.env.local') });

// Registrar resultados
const results = {
  environment: { status: 'pending', issues: [] },
  files: { status: 'pending', issues: [] },
  supabase: { status: 'pending', issues: [] },
  build: { status: 'pending', issues: [] },
  deploy: { status: 'pending', issues: [] }
};

// Cores para console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utilitários
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function warning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️ ${message}`, colors.blue);
}

function header(message) {
  log(`\n${colors.cyan}======== ${message} ========${colors.reset}\n`);
}

// 1. Verificar ambiente
async function checkEnvironment() {
  header('Verificando Ambiente');
  
  // Verificar Node.js
  try {
    const nodeVersion = process.version;
    success(`Node.js: ${nodeVersion}`);
    
    // Verificar se a versão é >= 18
    const versionNumber = Number(nodeVersion.slice(1).split('.')[0]);
    if (versionNumber < 18) {
      results.environment.issues.push('Node.js versão < 18');
      warning(`A versão do Node.js deve ser >= 18. Versão atual: ${nodeVersion}`);
    }
  } catch (err) {
    results.environment.issues.push('Erro ao verificar Node.js');
    error('Não foi possível verificar a versão do Node.js');
  }
  
  // Verificar variáveis de ambiente
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      results.environment.issues.push(`Variável ${varName} não definida`);
      error(`Variável de ambiente ${varName} não está definida`);
    } else {
      success(`Variável ${varName} definida`);
    }
  }
  
  // Verificar .env.local
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    success('Arquivo .env.local encontrado');
  } else {
    results.environment.issues.push('Arquivo .env.local não encontrado');
    error('Arquivo .env.local não encontrado');
  }
  
  // Definir status final
  results.environment.status = results.environment.issues.length > 0 ? 'warning' : 'success';
}

// 2. Verificar arquivos
async function checkFiles() {
  header('Verificando Arquivos');
  
  // Lista de arquivos essenciais
  const essentialFiles = [
    'package.json',
    'astro.config.mjs',
    'vercel.json',
    'src/pages/index.astro',
    'src/layouts/Layout.astro'
  ];
  
  for (const file of essentialFiles) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      success(`Arquivo ${file} encontrado`);
    } else {
      results.files.issues.push(`Arquivo ${file} não encontrado`);
      error(`Arquivo ${file} não encontrado`);
    }
  }
  
  // Verificar estrutura de diretórios
  const essentialDirs = [
    'src',
    'src/pages',
    'src/components',
    'src/layouts',
    'src/lib',
    'public'
  ];
  
  for (const dir of essentialDirs) {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      success(`Diretório ${dir} encontrado`);
    } else {
      results.files.issues.push(`Diretório ${dir} não encontrado`);
      error(`Diretório ${dir} não encontrado`);
    }
  }
  
  // Definir status final
  results.files.status = results.files.issues.length > 0 ? 'warning' : 'success';
}

// 3. Verificar Supabase
async function checkSupabase() {
  header('Verificando Conexão com Supabase');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    results.supabase.issues.push('Credenciais do Supabase não definidas');
    error('Credenciais do Supabase não definidas');
    results.supabase.status = 'error';
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verificar conexão
    info('Testando conexão com Supabase...');
    const { error: pingError } = await supabase.from('posts').select('count').limit(1);
    
    if (pingError) {
      results.supabase.issues.push(`Erro de conexão: ${pingError.message}`);
      error(`Erro ao conectar com Supabase: ${pingError.message}`);
    } else {
      success('Conexão com Supabase estabelecida com sucesso');
    }
    
    // Verificar autenticação
    info('Testando autenticação...');
    const adminEmail = 'admin@italo.dev';
    const adminPassword = 'Italo2025Admin!';
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (authError) {
      results.supabase.issues.push(`Erro de autenticação: ${authError.message}`);
      error(`Erro de autenticação: ${authError.message}`);
    } else {
      success('Autenticação funcionando corretamente');
      await supabase.auth.signOut();
    }
  } catch (err) {
    results.supabase.issues.push(`Erro geral: ${err.message}`);
    error(`Erro ao verificar Supabase: ${err.message}`);
  }
  
  // Definir status final
  results.supabase.status = results.supabase.issues.length > 0 ? 'warning' : 'success';
}

// 4. Verificar configuração de build
async function checkBuild() {
  header('Verificando Configuração de Build');
  
  // Verificar package.json
  try {
    const packagePath = path.join(rootDir, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Verificar scripts
    if (!packageData.scripts || !packageData.scripts.build) {
      results.build.issues.push('Script de build não encontrado em package.json');
      error('Script de build não encontrado em package.json');
    } else {
      success('Script de build encontrado');
    }
    
    // Verificar dependências
    const requiredDeps = ['astro', '@supabase/supabase-js'];
    for (const dep of requiredDeps) {
      if (!packageData.dependencies || !packageData.dependencies[dep]) {
        results.build.issues.push(`Dependência ${dep} não encontrada`);
        error(`Dependência ${dep} não encontrada em package.json`);
      } else {
        success(`Dependência ${dep} encontrada: ${packageData.dependencies[dep]}`);
      }
    }
    
    // Verificar engine
    if (!packageData.engines || !packageData.engines.node) {
      warning('Requisito de versão do Node.js não especificado em package.json');
    } else {
      success(`Requisito de Node.js: ${packageData.engines.node}`);
    }
  } catch (err) {
    results.build.issues.push(`Erro ao ler package.json: ${err.message}`);
    error(`Erro ao ler package.json: ${err.message}`);
  }
  
  // Verificar astro.config.mjs
  try {
    const astroConfigPath = path.join(rootDir, 'astro.config.mjs');
    if (fs.existsSync(astroConfigPath)) {
      const configContent = fs.readFileSync(astroConfigPath, 'utf8');
      
      // Verificar configuração de output
      if (!configContent.includes('output:')) {
        warning('Configuração de output não encontrada em astro.config.mjs');
      } else if (configContent.includes('output: \'static\'')) {
        success('Configuração de output está correta para deploy estático');
      } else {
        results.build.issues.push('Configuração de output pode não ser compatível com deploy estático');
        warning('Configuração de output pode não ser compatível com deploy estático');
      }
      
      // Verificar configuração de site
      if (!configContent.includes('site:')) {
        results.build.issues.push('URL do site não configurada em astro.config.mjs');
        warning('URL do site não configurada em astro.config.mjs');
      } else {
        success('URL do site configurada em astro.config.mjs');
      }
    } else {
      results.build.issues.push('Arquivo astro.config.mjs não encontrado');
      error('Arquivo astro.config.mjs não encontrado');
    }
  } catch (err) {
    results.build.issues.push(`Erro ao ler astro.config.mjs: ${err.message}`);
    error(`Erro ao ler astro.config.mjs: ${err.message}`);
  }
  
  // Definir status final
  results.build.status = results.build.issues.length > 0 ? 'warning' : 'success';
}

// 5. Verificar configuração de deploy
async function checkDeploy() {
  header('Verificando Configuração de Deploy');
  
  // Verificar vercel.json
  try {
    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    if (fs.existsSync(vercelConfigPath)) {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      success('Arquivo vercel.json encontrado');
      
      // Verificar configurações essenciais
      const requiredSettings = ['buildCommand', 'outputDirectory'];
      for (const setting of requiredSettings) {
        if (!vercelConfig[setting]) {
          results.deploy.issues.push(`Configuração ${setting} não encontrada em vercel.json`);
          warning(`Configuração ${setting} não encontrada em vercel.json`);
        } else {
          success(`Configuração ${setting}: ${vercelConfig[setting]}`);
        }
      }
      
      // Verificar configuração de redirects/rewrites
      if (!vercelConfig.rewrites || vercelConfig.rewrites.length === 0) {
        warning('Nenhuma regra de rewrite encontrada em vercel.json');
      } else {
        success(`${vercelConfig.rewrites.length} regras de rewrite configuradas`);
      }
    } else {
      results.deploy.issues.push('Arquivo vercel.json não encontrado');
      warning('Arquivo vercel.json não encontrado');
    }
  } catch (err) {
    results.deploy.issues.push(`Erro ao ler vercel.json: ${err.message}`);
    error(`Erro ao ler vercel.json: ${err.message}`);
  }
  
  // Verificar scripts de deploy
  try {
    const packagePath = path.join(rootDir, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const deployScripts = ['deploy', 'deploy:vercel', 'deploy:netlify'];
    let foundScripts = 0;
    
    for (const script of deployScripts) {
      if (packageData.scripts && packageData.scripts[script]) {
        success(`Script ${script} encontrado`);
        foundScripts++;
      }
    }
    
    if (foundScripts === 0) {
      results.deploy.issues.push('Nenhum script de deploy encontrado');
      warning('Nenhum script de deploy encontrado em package.json');
    }
  } catch (err) {
    results.deploy.issues.push(`Erro ao verificar scripts de deploy: ${err.message}`);
    error(`Erro ao verificar scripts de deploy: ${err.message}`);
  }
  
  // Definir status final
  results.deploy.status = results.deploy.issues.length > 0 ? 'warning' : 'success';
}

// Função principal
async function diagnoseProject() {
  console.log(`
🔍 DIAGNÓSTICO DE BUILD E DEPLOY
===================================
Projeto: Portfolio Astro + Supabase
Data: ${new Date().toLocaleString()}
  `);
  
  try {
    // Executar verificações
    await checkEnvironment();
    await checkFiles();
    await checkSupabase();
    await checkBuild();
    await checkDeploy();
    
    // Mostrar resumo
    header('RESUMO DO DIAGNÓSTICO');
    
    function getStatusIcon(status) {
      switch(status) {
        case 'success': return '✅';
        case 'warning': return '⚠️';
        case 'error': return '❌';
        default: return '❓';
      }
    }
    
    for (const [category, data] of Object.entries(results)) {
      const icon = getStatusIcon(data.status);
      const color = data.status === 'success' ? colors.green : 
                   data.status === 'warning' ? colors.yellow : colors.red;
      
      log(`${icon} ${category.toUpperCase()}: ${data.issues.length} problema(s)`, color);
      
      // Mostrar issues se houver
      if (data.issues.length > 0) {
        for (const issue of data.issues) {
          log(`  - ${issue}`, color);
        }
      }
    }
    
    // Recomendações finais
    header('RECOMENDAÇÕES');
    
    const totalIssues = Object.values(results).reduce((sum, category) => sum + category.issues.length, 0);
    
    if (totalIssues === 0) {
      success('Nenhum problema encontrado! O projeto está pronto para build e deploy.');
      console.log('\nPara prosseguir:');
      console.log('1. Execute "npm run build" para realizar o build');
      console.log('2. Para deploy na Vercel, execute "npm run deploy:vercel"');
    } else {
      warning(`${totalIssues} problema(s) encontrado(s). Resolva os problemas antes de prosseguir.`);
      
      // Recomendações específicas
      if (results.environment.issues.length > 0) {
        console.log('\nRecomendações para AMBIENTE:');
        console.log('- Verifique se o arquivo .env.local existe e contém as variáveis necessárias');
        console.log('- Certifique-se de que está usando Node.js versão 18 ou superior');
      }
      
      if (results.supabase.issues.length > 0) {
        console.log('\nRecomendações para SUPABASE:');
        console.log('- Verifique as credenciais do Supabase no arquivo .env.local');
        console.log('- Execute o script "fix-auth.bat" para resolver problemas de autenticação');
        console.log('- Verifique a conectividade com o Supabase');
      }
      
      if (results.build.issues.length > 0 || results.deploy.issues.length > 0) {
        console.log('\nRecomendações para BUILD/DEPLOY:');
        console.log('- Verifique a configuração em astro.config.mjs e vercel.json');
        console.log('- Consulte a documentação em DEPLOY.md para instruções detalhadas');
      }
    }
    
  } catch (err) {
    error(`Erro ao executar diagnóstico: ${err.message}`);
    console.error(err);
  }
}

// Executar diagnóstico
diagnoseProject();
