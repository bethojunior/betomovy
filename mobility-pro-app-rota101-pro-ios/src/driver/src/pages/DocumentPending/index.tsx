import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useTheme} from 'styled-components';
import {ItemDocument} from '../../components/ItemDocument';
import {useUserDriver} from '../../context/userDriver';
import {Container, DocumentList, Header, Title} from './styles';
import {translate} from '../../../../client/locales';

export function DocumentPending({route}) {
  const {navigate, goBack}: NavigationProp<ParamListBase> = useNavigation();
  const {colors} = useTheme();
  const {getDocumentsConfig} = useUserDriver();
  const [docsConfig, setDocsConfig] = useState([]);
  const {docs} = route.params;

  const OnInit = async () => {
    const response = await getDocumentsConfig();

    setDocsConfig(response);
  };

  const sendDocument = async item => {
    if (docsConfig.length === 0) {
      await OnInit();
    }

    if (docsConfig.length === 0) {
      return;
    }

    const response = docsConfig.find(doc => doc.id === item.docId);

    navigate('DocumentSend', {
      doc: item,
      docConfig: {
        pdf: response.pdf,
        text: response.text,
        image: response.image,
      },
    });
  };

  useEffect(() => {
    OnInit();
  }, []);

  return (
    <Container>
      <Header activeOpacity={1} onPress={() => goBack()}>
        <Ionicons name="chevron-back" size={40} color={colors.primary} />
        <Title>{translate('driverStatus.list_documents_title')}</Title>
      </Header>

      <DocumentList
        data={docs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <ItemDocument
            label={item.label}
            docStatus={item.docStatus}
            onPress={() => sendDocument(item)}
          />
        )}
      />
    </Container>
  );
}
