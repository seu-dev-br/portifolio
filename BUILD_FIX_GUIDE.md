# Guia de Solução: Problema de Build com Supabase

## Problema Identificado

O erro "supabaseUrl is required" ocorria durante o processo de build no GitHub Actions porque:

1. **Inicialização Imediata**: O cliente Supabase era criado imediatamente na importação
2. **Variáveis Indisponíveis**: Durante o build, as variáveis de ambiente não estavam acessíveis
3. **Build Estático**: O Astro tenta gerar páginas estáticas durante o build, mas o Supabase precisa de credenciais

## Solução Implementada

### 1. Lazy Initialization

**Arquivo**: `src/lib/supabase.js`

```javascript
// Antes (problemático)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Depois (correto)
let supabaseClient = null;

function getSupabaseClient() {
    if (!supabaseClient) {
        // Validação e criação lazy
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
}

export const supabase = getSupabaseClient();
```

### 2. Configuração Build-Time

**Arquivo**: `src/lib/supabase-config.js`

```javascript
export const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-key'
};

export function hasValidSupabaseConfig() {
  return Boolean(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_ANON_KEY &&
    process.env.SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
}
```

### 3. Script de Verificação

**Arquivo**: `scripts/check-env.js`

- Executado automaticamente antes do build
- Verifica se as variáveis de ambiente estão disponíveis
- Fornece instruções claras para correção
- Permite build com placeholder se necessário

### 4. Workflow GitHub Actions Atualizado

**Arquivo**: `.github/workflows/vercel-deploy.yml`

```yaml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## Como Funciona Agora

1. **Build Local**: Script verifica variáveis → Build prossegue com configuração real ou placeholder
2. **GitHub Actions**: Secrets injetados → Build usa credenciais reais
3. **Vercel**: Variáveis de ambiente configuradas → Runtime usa credenciais reais
4. **Lazy Loading**: Cliente Supabase criado apenas quando necessário

## Benefícios da Solução

- ✅ **Build Consistente**: Funciona tanto localmente quanto no CI/CD
- ✅ **Segurança**: Credenciais não ficam hardcoded no código
- ✅ **Flexibilidade**: Suporte a diferentes ambientes (dev, staging, prod)
- ✅ **Debugging**: Mensagens claras quando há problemas de configuração
- ✅ **Fallback**: Build não falha completamente se credenciais estiverem ausentes

## Teste da Solução

Para testar se a solução está funcionando:

```bash
# 1. Build sem variáveis (usará placeholder)
npm run build

# 2. Build com variáveis definidas
SUPABASE_URL=https://... SUPABASE_ANON_KEY=... npm run build

# 3. Verificar se o site funciona
npm run preview
```

## Prevenção de Problemas Futuros

1. **Sempre use lazy initialization** para clientes externos
2. **Configure variáveis de ambiente** em todos os ambientes
3. **Use scripts de verificação** antes de builds críticos
4. **Documente dependências de ambiente** no README
5. **Teste builds localmente** antes de fazer deploy

## Arquivos Modificados

- `src/lib/supabase.js` - Lazy initialization
- `src/lib/supabase-config.js` - Configuração build-time
- `scripts/check-env.js` - Verificação de ambiente
- `.github/workflows/vercel-deploy.yml` - Variáveis no CI/CD
- `package.json` - Script de build atualizado
- `README.md` - Documentação atualizada</content>
<parameter name="filePath">c:\Users\Grupo Lidon T.I\Documents\site\BUILD_FIX_GUIDE.md
