import {ScrollView} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {ModuleFallbackImage} from '../ModuleFallbackImage';
import {
  ModuleButton,
  ModuleIconWrapper,
  ModuleImage,
  ModuleLabel,
  ModuleRow,
  ModuleSection,
  moduleRowContentStyle,
} from './styles';
import {ModuleGridProps} from './types';

export function ModuleGrid({modules, onModulePress}: ModuleGridProps) {
  return (
    <ModuleSection>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={moduleRowContentStyle}
      >
        <ModuleRow>
          {modules.map((item, index) => (
            <ModuleButton
              activeOpacity={0.8}
              onPress={() => onModulePress(item.moduleName)}
              key={index}
            >
              <ModuleIconWrapper>
                {item.logo ? (
                  <ModuleImage source={{uri: item.logo}} />
                ) : (
                  <ModuleFallbackImage moduleName={item.moduleName} size={RFValue(34)} />
                )}
              </ModuleIconWrapper>
              <ModuleLabel>{item.moduleName}</ModuleLabel>
            </ModuleButton>
          ))}
        </ModuleRow>
      </ScrollView>
    </ModuleSection>
  );
}
