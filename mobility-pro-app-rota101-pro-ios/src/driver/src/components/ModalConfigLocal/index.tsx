import {
  Container,
  ContainerButton,
  ContainerHeader,
  ContainerInput,
  Input,
  ModalComponent,
  TextLocal,
} from './styles';
import {FlatList, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import theme from '../../../../client/styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';
import {useConfigLocal} from '../../context/ConfigLocal';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ModalConfigLocal = () => {
  const {states, setStates} = useConfigLocal();
  const [statesLocal, setStatesLocal] = useState(states);

  const handleConfirm = () => {
    setStates({...statesLocal, visibleConfigHidden: false});
    setStatesLocal(states);
    AsyncStorage.setItem('configLocal', JSON.stringify(statesLocal));
  };

  const getPlaceholderInput = (key: string) => {
    try {
      const value = statesLocal[key];
      return value.toString();
    } catch (error) {
      console.log(error);
      return '';
    }
  };

  return (
    <ModalComponent>
      <Container>
        <ContainerHeader>
          <Text>Configurações adicionais</Text>
          <Ionicons
            name="close"
            size={RFValue(20)}
            onPress={() => setStates({...states, visibleConfigHidden: false})}
            color={theme.colors.primary}
          />
        </ContainerHeader>

        {Object?.keys(states)
          ?.filter(item => item !== 'visibleConfigHidden')
          .map(item => (
            <ContainerInput key={item}>
              <TextLocal>{item}</TextLocal>

              <Input
                placeholder={getPlaceholderInput(item)}
                value={String(statesLocal[item])}
                onChangeText={text => {
                  if (item === 'strokePolylineColor') {
                    return setStatesLocal({...statesLocal, [item]: text});
                  }
                  return setStatesLocal({...statesLocal, [item]: Number(text)});
                }}
              />
            </ContainerInput>
          ))}

        <ContainerButton onPress={handleConfirm}>
          <Ionicons
            name="checkmark"
            size={RFValue(20)}
            color={theme.colors.primaryText}
          />
        </ContainerButton>
      </Container>
    </ModalComponent>
  );
};
