import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import apiMain from '../../api/apiMain';
import { Container, Content, LoadingContainer, SimpleText } from './styles';

export function TermsOfUse() {
  const route = useRoute<any>();
  const theme = useTheme();
  const colorText = route.params?.colorText;
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTerms = async () => {
    setLoading(true);

    try {
      const response = await apiMain.get('termsUsePolicy/findByType?type=partner');
      setTerms(response.data.data.description);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colorText || theme.colors.primary} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Content>
        <SimpleText colorText={colorText}>{terms}</SimpleText>
      </Content>
    </Container>
  );
}
