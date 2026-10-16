/** Regra de habilitação do botão confirmar — isolada da apresentação. */
export function isCouponCodeValid(code: string): boolean {
  return code.trim().length > 0;
}
