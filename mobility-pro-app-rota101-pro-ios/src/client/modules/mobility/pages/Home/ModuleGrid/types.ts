import {ModuleItem} from '../../../../../contexts/modules';

export interface ModuleGridProps {
  modules: ModuleItem[];
  onModulePress: (moduleName: string) => void;
}
