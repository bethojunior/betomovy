import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useDevTools, SIMULATION_ROUTE } from '../../context/DevTools';
import {
  SectionWrapper,
  SectionLabel,
  Group,
  Row,
  ActionRow,
  Label,
  ValueText,
  ActionLabel,
  colors as menuColors,
} from '~/components/DevMenu/styles';

export const MapSimulationSection = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { simulation, startSimulation, stopSimulation } = useDevTools();

  const handleStart = () => {
    startSimulation();
    navigation.navigate('Home' as never);
  };

  return (
    <SectionWrapper>
      <SectionLabel>Mapa</SectionLabel>
      <Group>
        <Row>
          <Label>Simulação de rota</Label>
          <ValueText>
            {simulation.active ? `${simulation.index + 1} / ${SIMULATION_ROUTE.length}` : 'Inativa'}
          </ValueText>
        </Row>
        <ActionRow last onPress={simulation.active ? stopSimulation : handleStart}>
          <MaterialIcons
            name={simulation.active ? 'stop' : 'play-arrow'}
            size={16}
            color={simulation.active ? colors.red : menuColors.blue}
          />
          <ActionLabel style={simulation.active ? { color: colors.red } : undefined}>
            {simulation.active ? 'Parar simulação' : 'Simular rota (Arthur Lenharo → Shopping)'}
          </ActionLabel>
        </ActionRow>
      </Group>
    </SectionWrapper>
  );
};
