// Tokens do MOVY Executive Design System (docs/reconstrucao-movy/DESIGN_SYSTEM.md).
// Fallbacks garantem uso nos temas cliente e motorista.
interface MovyThemeLike {
  colors: Record<string, string | undefined>;
}

const c = (t: MovyThemeLike, key: string, fallback: string) =>
  t.colors?.[key] ?? fallback;

export const movy = {
  navy: (t: MovyThemeLike) => c(t, 'navy_deep', '#070A1A'),
  navyCard: (t: MovyThemeLike) => c(t, 'card_dark', '#0B1220'),
  cyan: (t: MovyThemeLike) => c(t, 'cyan_electric', '#04F3FA'),
  royal: (t: MovyThemeLike) => c(t, 'blue_royal', '#00349A'),
  canvas: (t: MovyThemeLike) => c(t, 'gray_canvas', '#F8F9FA'),
  border: (t: MovyThemeLike) => c(t, 'gray_border', '#E2E8F0'),
  darkBorder: (t: MovyThemeLike) => c(t, 'dark_border', '#1E293B'),
  muted: (t: MovyThemeLike) => c(t, 'gray_muted', '#64748B'),
  success: (t: MovyThemeLike) => c(t, 'success_emerald', '#10B981'),
  danger: (t: MovyThemeLike) => c(t, 'danger_crimson', '#EF4444'),
  warning: (t: MovyThemeLike) => c(t, 'warning_amber', '#F59E0B'),
};
