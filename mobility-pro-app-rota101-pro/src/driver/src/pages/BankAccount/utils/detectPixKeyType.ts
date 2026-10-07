export type PixKeyType = 'cpf_cnpj' | 'phone' | 'email' | 'random';

const UUID_PATTERN = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/**
 * Só uma sugestão inicial pro seletor de tipo (o motorista escolhe manualmente depois) —
 * não tenta mais desambiguar CPF de telefone sozinho, o usuário quem decide.
 */
export function suggestPixKeyType(value?: string): PixKeyType | null {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return null;

  if (trimmed.includes('@')) return 'email';
  if (UUID_PATTERN.test(trimmed)) return 'random';

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 11 || digits.length === 14) return 'cpf_cnpj';
  if (digits.length === 10) return 'phone';

  return null;
}
