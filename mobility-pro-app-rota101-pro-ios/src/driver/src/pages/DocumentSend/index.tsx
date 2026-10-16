import { useNavigation } from '@react-navigation/native';
import { DocumentSend as SharedDocumentSend } from '../../../../common/components/DocumentSend';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { InputContainer } from '../../components/InputContainer';
import CapturePicture from '../../../../common/components/CapturePicture';
import { schema } from './schema';
import { translate } from '../../../../client/locales';
import { validateFileSize as validateFileSizeUtil } from '../../../../utils/fileValidation';
import { customToast } from '../../../../utils/FlashMessage';
import { sanitizeFilename, getMimeType } from '../../../../utils/fileSecurity';
import { resizeImage } from '../../../../utils/image';
import { useDocumentsRepository } from '../../hooks/useDocumentsRepository';

export function DocumentSend({ route }) {
  const { goBack } = useNavigation();
  const repository = useDocumentsRepository();

  const validateFileSize = (size: number, type: 'image' | 'pdf') => {
    const result = validateFileSizeUtil(size, type);
    return { isValid: result.isValid, limitMB: result.limitMB || 40 };
  };

  return (
    <SharedDocumentSend
      route={route}
      uiKit={{ Button, Input, InputContainer, CapturePicture }}
      fileHandlers={{ validateFileSize, sanitizeFilename, getMimeType, resizeImage }}
      schema={schema}
      sendDocument={repository.sendDocument}
      translate={translate}
      customToast={customToast}
      onDocumentSent={goBack}
    />
  );
}
