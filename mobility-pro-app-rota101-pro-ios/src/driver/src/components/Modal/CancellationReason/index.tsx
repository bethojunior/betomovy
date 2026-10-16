import {useEffect, useState} from 'react';
import {SimpleLineIcons, Ionicons} from '@expo/vector-icons';

import {TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components';
import {translate} from '../../../../../client/locales';
import {useTripProvider} from '../../../context/Trip';
import {
  ButtonConfirm,
  ButtonContent,
  ButtonReason,
  ContainerAll,
  ContainerButton,
  Content,
  ContentDescription,
  Description,
  Header,
  ReasonName,
  ViewRelative,
} from './styles';
import {If} from '../../If';
import {TextEdit} from '../../TextEdit';
import theme from '../../../styles/theme';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  cancelTripAccepted: (id: number) => void;
}

export const ModalCancellationReasons = ({
  visible,
  setVisible,
  cancelTripAccepted,
}: ModalProps) => {
  const [listReasons, setListReasons] = useState([]);
  const [idSelected, setIdSelected] = useState(0);

  const getCancellationReasons: any = useTripProvider(
    (context: any) => context.getCancellationReasons,
  );
  const {colors} = useTheme();

  useEffect(() => {
    const get = async () => {
      setListReasons(await getCancellationReasons());
    };

    get();
  }, []);

  return (
    <If condition={visible}>
      <ViewRelative
        from={{
          opacity: 0,
          transform: [{translateY: 150}],
        }}
        animate={{
          opacity: 1,
          transform: [{translateY: 0}],
        }}
        exit={{
          opacity: 0,
          transform: [{translateY: 0}],
        }}
      >
        <ContainerAll>
          <Header>
            <Ionicons
              name="arrow-back"
              size={RFValue(20)}
              color={colors.secondary}
              onPress={() => {
                setVisible(false);
                setIdSelected(0);
              }}
            />
            <TextEdit color={colors.secondary}>
              {translate('trip.cancel_trip')}?
            </TextEdit>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setVisible(false);
                setIdSelected(0);
              }}
            >
              <TextEdit color={colors.secondary}>
                {translate('trip.ignore')}
              </TextEdit>
            </TouchableOpacity>
          </Header>
          <ContentDescription>
            <Description>
              {translate('trip.why_you_want_cancel_trip')}
            </Description>
          </ContentDescription>
          <Content>
            {listReasons?.map(item => {
              return (
                <ButtonReason
                  activeOpacity={0.9}
                  key={item.idCancellationReasons}
                  onPress={() => setIdSelected(item.idCancellationReasons)}
                  selected={item.idCancellationReasons === idSelected}
                >
                  <ButtonContent>
                    <ReasonName
                      selected={item.idCancellationReasons === idSelected}
                    >
                      {item.name}
                    </ReasonName>
                    <SimpleLineIcons
                      name="arrow-right"
                      size={13}
                      color={
                        item.idCancellationReasons === idSelected
                          ? theme.colors.primaryText
                          : theme.colors.secondary
                      }
                    />
                  </ButtonContent>
                </ButtonReason>
              );
            })}
          </Content>
          <ContainerButton>
            <If condition={idSelected !== 0}>
              <ButtonConfirm
                onPress={() => {
                  cancelTripAccepted(idSelected);
                  setVisible(false);
                  setIdSelected(0);
                }}
              >
                <TextEdit color={theme.colors.primaryText}>
                  {translate('dialog.confirm')}
                </TextEdit>
              </ButtonConfirm>
            </If>
          </ContainerButton>
        </ContainerAll>
      </ViewRelative>
    </If>
  );
};
