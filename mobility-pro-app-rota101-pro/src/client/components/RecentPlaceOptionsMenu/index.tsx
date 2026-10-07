import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {BottomSheetModal} from '../BottomSheetModal';
import {translate} from '../../locales';
import {OptionRow, OptionText, Title} from './styles';
import {RecentPlaceOptionsMenuProps} from './types';

export function RecentPlaceOptionsMenu({
  visible,
  address,
  isFavorite,
  onRequestClose,
  onToggleFavorite,
  onDelete,
}: RecentPlaceOptionsMenuProps) {
  const {colors} = useTheme();

  return (
    <BottomSheetModal visible={visible} onRequestClose={onRequestClose}>
      {address && <Title numberOfLines={1}>{address}</Title>}

      <OptionRow
        onPress={() => {
          onToggleFavorite();
          onRequestClose();
        }}
      >
        <Ionicons
          name={isFavorite ? 'star' : 'star-outline'}
          size={RFValue(20)}
          color={colors.primary}
        />
        <OptionText>
          {translate(
            isFavorite ? 'home.text_unfavorite_place' : 'home.text_favorite_place',
          )}
        </OptionText>
      </OptionRow>

      <OptionRow
        onPress={() => {
          onDelete();
          onRequestClose();
        }}
      >
        <Ionicons name="trash-outline" size={RFValue(20)} color={colors.destructive} />
        <OptionText color={colors.destructive}>
          {translate('home.text_delete_place')}
        </OptionText>
      </OptionRow>
    </BottomSheetModal>
  );
}
