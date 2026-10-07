/** Escopa um id de gradiente SVG por instância, evitando colisão quando vários ícones iguais renderizam juntos no DOM. */
export const scopeSvgId = (id: string, uid: string): string =>
  `${id}-${uid.replace(/:/g, "")}`;
