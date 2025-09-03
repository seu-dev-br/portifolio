# 🧪 Guia de Testes - Projeto Astro com Supabase

Este projeto utiliza **Vitest** para testes unitários e de integração, configurado especificamente para projetos Astro.

## 📋 Scripts de Teste Disponíveis

```bash
# Executar testes em modo watch (desenvolvimento)
npm test

# Executar testes uma vez
npm run test:run

# Executar testes com interface visual
npm run test:ui

# Executar testes com relatório de cobertura
npm run test:coverage
```

## 🛠️ Estrutura de Testes

```
src/
├── test/
│   └── setup.ts          # Configurações globais de teste
├── lib/
│   ├── supabase.js       # Funções principais
│   └── supabase.test.ts  # Testes das funções Supabase
└── components/
    └── Welcome.test.tsx  # Testes de componentes
```

## 📝 Escrevendo Testes

### Teste de Funções (Exemplo)

```typescript
import { describe, it, expect } from 'vitest';
import { minhaFuncao } from './minha-funcao.js';

describe('minhaFuncao', () => {
  it('deve retornar resultado esperado', () => {
    const resultado = minhaFuncao('input');
    expect(resultado).toBe('esperado');
  });
});
```

### Teste com Mocks

```typescript
import { vi } from 'vitest';

// Mock de função
const mockFuncao = vi.fn(() => 'mocked result');

// Mock de módulo
vi.mock('./modulo', () => ({
  funcao: mockFuncao
}));
```

## 🎯 Funcionalidades de Teste

### ✅ Assertions Disponíveis

- `expect(value).toBe(expected)` - Igualdade estrita
- `expect(value).toEqual(expected)` - Igualdade profunda
- `expect(value).toContain(item)` - Verificar se contém
- `expect(value).toHaveLength(length)` - Verificar tamanho
- `expect(value).toBeDefined()` - Verificar se definido
- `expect(value).toBeNull()` - Verificar se null

### 🧩 Mocks e Spies

```typescript
// Spy em função existente
const spy = vi.spyOn(obj, 'method');

// Mock de função
const mock = vi.fn().mockReturnValue('value');

// Mock de módulo
vi.mock('./module', () => ({ /* mock implementation */ }));
```

## 🔧 Configuração

### Vitest Config (`vitest.config.ts`)

- **Environment**: `jsdom` para testes de DOM
- **Globals**: Habilitado para usar `describe`, `it`, `expect`
- **Setup**: Arquivo `src/test/setup.ts` executado antes dos testes
- **Coverage**: Relatórios em texto, JSON e HTML

### Setup Global (`src/test/setup.ts`)

- Configurações do `@testing-library/jest-dom`
- Mock do `window.matchMedia` para testes
- Mock do Supabase para testes isolados

## 🚀 Executando Testes

### Desenvolvimento (Watch Mode)

```bash
npm test
```

Este comando executa os testes em modo watch, re-executando automaticamente quando arquivos são modificados.

### Interface Visual

```bash
npm run test:ui
```

Abre uma interface web para visualizar e executar testes interativamente.

### Cobertura de Código

```bash
npm run test:coverage
```

Gera relatório de cobertura em `coverage/` com métricas detalhadas.

## 📊 Relatórios de Cobertura

Os relatórios incluem:
- **Statements**: Linhas executadas
- **Branches**: Ramificações condicionais
- **Functions**: Funções chamadas
- **Lines**: Linhas de código

## 🎨 Boas Práticas

### 1. Nomeclatura
- Use `describe` para agrupar testes relacionados
- Use `it` para descrever o comportamento esperado
- Nomes descritivos: `"deve retornar erro para input inválido"`

### 2. Estrutura AAA
```typescript
it('deve fazer algo', () => {
  // Arrange - Preparar
  const input = 'valor';

  // Act - Executar
  const result = funcao(input);

  // Assert - Verificar
  expect(result).toBe('esperado');
});
```

### 3. Mocks Apropriados
- Mock apenas o necessário
- Use `vi.clearAllMocks()` em `beforeEach`
- Prefira mocks específicos a mocks globais

### 4. Testes Independentes
- Cada teste deve ser independente
- Não depender de estado de outros testes
- Usar `beforeEach` para setup

## 🔍 Debugging

### Console Logs
```typescript
it('debug test', () => {
  console.log('Debug value:', value);
  // Use debugger; para breakpoints
});
```

### Interface Visual
```bash
npm run test:ui
```

Permite executar testes individualmente e ver detalhes de falhas.

## 📚 Recursos Adicionais

- [Documentação Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)

---

**💡 Dica**: Comece escrevendo testes para funções utilitárias e gradualmente expanda para componentes e integrações!
