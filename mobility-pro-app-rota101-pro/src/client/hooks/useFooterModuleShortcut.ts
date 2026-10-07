import {useModules} from '../contexts/modules';

/**
 * Quando exatamente 1 módulo (fora "Mobilidade") está ativo, retorna esse
 * módulo pra virar um atalho no footer — com 0 módulos extras não há o que
 * mostrar, com 2+ já existe o grid "Serviços" na Home pra isso.
 */
export function useFooterModuleShortcut() {
  const {modulesActives} = useModules();

  const otherModules = (modulesActives ?? []).filter(
    (module: {moduleName: string}) => module.moduleName !== 'Mobilidade',
  );

  return otherModules.length === 1 ? otherModules[0] : null;
}
