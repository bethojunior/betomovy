import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { ItemDocument } from '../ItemDocument';
import { InfoBanner } from '../InfoBanner';
import { DocumentListItem } from '../../services/documents/types';
import {
  Container,
  Header,
  BackButton,
  Title,
  ScrollContent,
  Subtitle,
  Card,
  EmptyContainer,
  EmptyTitle,
  EmptyText,
  Footer,
} from './styles';
import { DocumentListProps } from './types';

export function DocumentList({
  repository,
  Button,
  translate,
  onSelectDocument,
  onGoBack,
  onContactSupport,
}: DocumentListProps) {
  const { colors } = useTheme();
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      setDocuments(await repository.getDocuments());
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useFocusEffect(useCallback(() => { fetchDocuments(); }, [fetchDocuments]));

  const hasPendingDocuments = documents.some(doc => doc.docStatusId !== '1');

  return (
    <Container>
      <Header activeOpacity={1} onPress={onGoBack}>
        <BackButton>
          <Ionicons name="chevron-back" size={RFValue(28)} color={colors.primary} />
        </BackButton>
        <Title>{translate('documents.list_title')}</Title>
      </Header>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1, alignSelf: 'center' }} />
      ) : documents.length === 0 ? (
        <EmptyContainer>
          <Ionicons name="document-outline" size={RFValue(60)} color={colors.grayLight} />
          <EmptyTitle>{translate('documentEmpty.title')}</EmptyTitle>
          <EmptyText>{translate('documentEmpty.description')}</EmptyText>
        </EmptyContainer>
      ) : (
        <ScrollContent showsVerticalScrollIndicator={false}>
          <Subtitle>{translate('documents.list_intro_description')}</Subtitle>

          <Card>
            {documents.map((item, index) => (
              <ItemDocument
                key={item.docId}
                label={item.label}
                docStatusId={item.docStatusId}
                docStatus={item.docStatus}
                hasDocument={item.hasDocument}
                image={item.image}
                text={item.text}
                pdf={item.pdf}
                isLast={index === documents.length - 1}
                onPress={() => onSelectDocument(item)}
              />
            ))}
          </Card>

          {hasPendingDocuments && (
            <InfoBanner
              variant="warning"
              icon={color => <Feather name="info" size={RFValue(20)} color={color} />}
              title={translate('documents.list_validation_title')}
              description={translate('documents.list_validation_description')}
            />
          )}
        </ScrollContent>
      )}

      {!!onContactSupport && (
        <Footer>
          <Button
            title={translate('support.button_label')}
            onPress={onContactSupport}
            icon={<Ionicons name="logo-whatsapp" size={RFValue(20)} color={colors.primaryText} />}
          />
        </Footer>
      )}
    </Container>
  );
}
