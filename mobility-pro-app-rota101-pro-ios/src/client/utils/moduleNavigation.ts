/**
 * Mapa appModules.name => nome da Screen dentro de TripRoutes, só pros módulos
 * cuja Screen técnica não bate com o nome/label do módulo E que vivem dentro
 * de TripRoutes (ex.: "Rotas" é exibido assim mas a Screen interna continua
 * se chamando "SharedTrips"). Módulos fora desse mapa são Screens de nível
 * raiz — navegam direto por `navigation.navigate(...)`.
 */
export const MODULE_NAME_TO_TRIP_SCREEN: Record<string, string> = {
  Frete: 'Freight',
  Rotas: 'SharedTrips',
};

/**
 * Mesma ideia, mas pra módulos de nível raiz cujo nome de exibição não bate
 * com a Screen técnica (ex.: "Serviços" é exibido assim, Screen continua
 * "GetLight").
 */
export const ROOT_MODULE_SCREEN_ALIASES: Record<string, string> = {
  'Serviços': 'GetLight',
};

export function resolveModuleScreen(moduleName: string): string {
  return MODULE_NAME_TO_TRIP_SCREEN[moduleName] ?? ROOT_MODULE_SCREEN_ALIASES[moduleName] ?? moduleName;
}
