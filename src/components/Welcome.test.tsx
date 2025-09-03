import { describe, it, expect } from 'vitest';

// Teste simples para funções utilitárias
describe('Utility Functions', () => {
  it('deve executar teste básico', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve verificar string', () => {
    const greeting = 'Olá, mundo!';
    expect(greeting).toContain('Olá');
  });

  it('deve verificar array', () => {
    const technologies = ['HTML', 'CSS', 'JavaScript', 'Astro'];
    expect(technologies).toHaveLength(4);
    expect(technologies).toContain('Astro');
  });
});
