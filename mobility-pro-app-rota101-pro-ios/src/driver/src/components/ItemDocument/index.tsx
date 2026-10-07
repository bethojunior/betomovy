import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components';
import {DocsUserProps} from '../../context/userDriver/types';

import {Container, ContentDoc, Doc, Status, StatusText} from './styles';

export interface ItemDocumentProps extends DocsUserProps {
  onPress?: () => void;
}

export function ItemDocument({label, docStatus, onPress}: ItemDocumentProps) {
  const {colors} = useTheme();

  return (
    <Container activeOpacity={0.8} onPress={onPress}>
      <ContentDoc>
        <Doc>{label}</Doc>

        <Status>
          <MaterialCommunityIcons
            name="file-clock-outline"
            size={20}
            color={colors.primary}
          />

          <StatusText>{docStatus}</StatusText>
        </Status>
      </ContentDoc>

      <MaterialCommunityIcons
        name="chevron-right"
        size={32}
        color={colors.primary}
      />
    </Container>
  );
}
