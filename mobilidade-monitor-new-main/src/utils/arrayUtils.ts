/**
 * Remove duplicatas do array pela chave informada, mantendo a primeira ocorrência.
 */
export function deduplicateByKey<T>(array: T[], key: keyof T): T[] {
  return array.filter((item, index, self) => index === self.findIndex((x) => x[key] === item[key]));
}
