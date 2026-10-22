import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, TouchableOpacity, Text, View } from 'react-native';
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
      if (response?.data?.data?.description) {
        setTerms(response.data.data.description);
      }
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
        <View style={{ marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://movymob.com/privacy')}
            style={{
              padding: 12,
              backgroundColor: '#0284c7',
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>
              Ver Política de Privacidade Online (Web)
            </Text>
          </TouchableOpacity>
        </View>
        <SimpleText colorText={colorText}>
          {terms || 'Carregando termos e políticas de privacidade...'}
        </SimpleText>
      </Content>
    </Container>
  );
}
