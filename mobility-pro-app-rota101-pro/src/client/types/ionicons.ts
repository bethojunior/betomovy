import type {ComponentProps} from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

/** Nome de ícone válido do Ionicons, derivado do próprio componente (sem `any`). */
export type IoniconName = ComponentProps<typeof Ionicons>['name'];
