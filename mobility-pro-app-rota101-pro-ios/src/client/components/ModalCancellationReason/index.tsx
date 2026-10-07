import {useEffect, useState} from 'react';
import {SimpleLineIcons, Ionicons} from '@expo/vector-icons';
import {Alert, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components';
import {translate} from '../../locales';
import {useTrip} from '../../contexts/Trip';
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
import {If} from '../If';
import {TextEdit} from '../TextEdit';
import theme from '../../styles/theme';
import {customToast} from '../../../utils/FlashMessage';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ModalCancellationReasonsCustomer = ({
  visible,
  setVisible,
}: ModalProps) => {
  const [listReasons, setListReasons] = useState([]);
  const [idSelected, setIdSelected] = useState(0);

  const {getCancellationReasons, cancelTripByCustomer} = useTrip();
  const {colors} = useTheme();

  const showAlert = async () => {
    setVisible(false);
    return Alert.alert(
      translate('trip.cancel_trip'),
      translate('trip.text_dialog_cancel'),
      [
        {
          text: translate('cleanBagModal.text_confirmed'),
          onPress: async () => {
            await cancelTripByCustomer(idSelected);
            setIdSelected(0);
            customToast(
              translate('trip.your_trip_has_been_canceled'),
              'success',
            );
          },
        },

        {
          text: translate('cleanBagModal.text_denied'),
          onPress: () => {
            setIdSelected(0);
          },
        },
      ],
      {cancelable: false},
    );
  };

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
                  onPress={() => {
                    setIdSelected(item.idCancellationReasons);
                  }}
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
                          ? colors.primaryText
                          : colors.secondary
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
                  showAlert();
                }}
              >
                <TextEdit color={theme.colors.primaryText}>{translate('dialog.confirm')}</TextEdit>
              </ButtonConfirm>
            </If>
          </ContainerButton>
        </ContainerAll>
      </ViewRelative>
    </If>
  );
};
