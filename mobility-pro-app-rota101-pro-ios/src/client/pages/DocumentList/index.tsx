import { Linking } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { DocumentList as SharedDocumentList } from '../../../common/components/DocumentList';
import { Button } from '../../components/Button';
import { translate } from '../../locales';
import { useSupportNumber } from '../../../hooks/useSupportNumber';
import { useDocumentsRepository } from '../../hooks/useDocumentsRepository';

export function DocumentList() {
  const { navigate, goBack }: NavigationProp<ParamListBase> = useNavigation();
  const { getSupportNumberFormatted } = useSupportNumber();
  const repository = useDocumentsRepository();
  const supportNumber = getSupportNumberFormatted();

  return (
    <SharedDocumentList
      repository={repository}
      Button={Button}
      translate={translate}
      onGoBack={goBack}
      onSelectDocument={item =>
        navigate('DocumentSend', {
          doc: { docId: item.docId, label: item.label, text: item.text, hasDocument: item.hasDocument },
          docConfig: item.config,
        })
      }
      onContactSupport={supportNumber ? () => Linking.openURL(`https://wa.me/${supportNumber}/`) : undefined}
    />
  );
}
