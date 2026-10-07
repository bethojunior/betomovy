import { FC } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { EmptyContainer, EmptyIconCircle, EmptyTitle } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';

interface ListEmptyDataProps {
  title: string;
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  iconSize?: number;
}

export const ListEmptyData: FC<ListEmptyDataProps> = ({
  title,
  icon = 'inbox',
  iconSize = RFValue(24),
}) => {
  const theme = useTheme();

  return (
    <EmptyContainer>
      <EmptyIconCircle>
        <MaterialIcons name={icon} size={iconSize} color={theme.colors.primary} />
      </EmptyIconCircle>
      <EmptyTitle>{title}</EmptyTitle>
    </EmptyContainer>
  );
};

export default ListEmptyData;
