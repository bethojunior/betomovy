import Ionicons from '@expo/vector-icons/Ionicons';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTheme} from 'styled-components';
import AntDesign from '@expo/vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import {ActivityIndicator, Modal} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Button} from '../../components/Button';
import {If} from '../../components/If';
import {Input} from '../../components/Input';
import {InputContainer} from '../../components/InputContainer';
import {useUserDriver} from '../../context/userDriver';
import {PdfProps} from '../../context/userDriver/types';
import {uploadDocument} from '../../utils/pdf/upload';
import {schema} from './schema';

import {
  Attention,
  Container,
  ContainerModal,
  Content,
  ContentOptions,
  ContentOptionsButtons,
  ContentOptionsText,
  ContentPdfSend,
  ContentPhotoSend,
  ContentSendText,
  Exit,
  Header,
  PdfText,
  PdfWrapper,
  PhotoWrapper,
  PreviewPhoto,
  Title,
} from './styles';
import CapturePicture from '../../components/CapturePicture';
import {resizeImage} from '../../utils/image';
import {translate} from '../../../../client/locales';

interface PhotoProps {
  uri: string;
  type: string;
  name: string;
}

export function DocumentSend({route}) {
  const {goBack}: NavigationProp<ParamListBase> = useNavigation();
  const {doc, docConfig} = route.params;
  const {colors} = useTheme();
  const {getDocumentsConfig, sendDocument} = useUserDriver();
  const [pdfFile, setPdfFile] = useState<PdfProps>({});
  const [loadingSendPfd, setLoadingSendPfd] = useState(false);
  const [loadingSendText, setLoadingSendText] = useState(false);
  const [loadingSendPicture, setLoadingSendPicture] = useState(false);
  const [visibleCamera, setVisibleCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoProps | any>({});
  const [modalSelectTypePhoto, setModalSelectTypePhoto] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const sendDocumentText = async data => {
    setLoadingSendText(true);
    await sendDocument(data.document, null, null, doc.docId);
    setLoadingSendText(false);
  };

  const onPdf = async () => {
    const response = await uploadDocument('application/pdf');

    if (response.type === 'cancel') return;

    // @ts-ignore
    setPdfFile(response);
  };

  const sendDocumentPdf = async () => {
    setLoadingSendPfd(true);
    await sendDocument(null, null, pdfFile, doc.docId);

    setPdfFile({});

    setLoadingSendPfd(false);
  };

  const onPhoto = async photo => {
    setCapturedPhoto(photo);
    setVisibleCamera(false);
  };

  const onCamera = () => {
    setModalSelectTypePhoto(false);
    setVisibleCamera(true);
  };

  const onGallery = async () => {
    setModalSelectTypePhoto(false);
    const response = await uploadDocument('image/*');

    if (response.type === 'cancel') return;

    // @ts-ignore
    const manipulatedImage = await resizeImage(response.uri, 512, 512);

    const filename = manipulatedImage.uri.split('/').pop();

    const match = /\.(\w+)$/.exec(filename);
    const typeImage = match ? `image/${match[1]}` : `image`;

    setCapturedPhoto({
      uri: manipulatedImage.uri,
      type: typeImage,
      name: filename,
    });
  };

  const sendDocumentPhoto = async () => {
    setLoadingSendPicture(true);
    if (Object.keys(capturedPhoto).length > 0) {
      // @ts-ignore
      await sendDocument(null, capturedPhoto, null, doc.docId);
    }
    setCapturedPhoto({});
    setLoadingSendPicture(false);
  };

  useEffect(() => {
    getDocumentsConfig();
  }, []);

  useEffect(() => {
    setValue('document', doc.text);
  }, [doc.value]);

  return (
    <Container>
      <Header activeOpacity={1} onPress={() => goBack()}>
        <Ionicons
          style={{
            position: 'absolute',
            left: RFValue(5),
          }}
          name="chevron-back"
          size={40}
          color={colors.primary}
        />
        <Title>{doc.label}</Title>
      </Header>

      <Content>
        <If condition={docConfig.text === '1'}>
          <ContentSendText>
            <InputContainer label={doc.label}>
              <Input
                name="document"
                control={control}
                // @ts-ignore
                error={errors.document && errors.document.message}
                placeholder={translate('driverStatus.label_input_document')}
              />
            </InputContainer>

            <Button
              title={translate('driverStatus.button_send')}
              onPress={handleSubmit(sendDocumentText)}
              small
              enabled={loadingSendText === false}
              loading={loadingSendText}
            />
          </ContentSendText>
        </If>

        <If condition={docConfig.pdf === '1'}>
          <ContentPdfSend>
            <InputContainer label={translate('driverStatus.label_pdf')}>
              <PdfWrapper
                pdf={Object.keys(pdfFile).length > 0}
                onPress={() =>
                  Object.keys(pdfFile).length > 0 || loadingSendPfd === true
                    ? {}
                    : onPdf()
                }
              >
                <If
                  condition={
                    Object.keys(pdfFile).length === 0 &&
                    loadingSendPfd === false
                  }
                >
                  <AntDesign name="addfile" size={40} color={colors.primary} />
                </If>

                <If
                  condition={
                    Object.keys(pdfFile).length > 0 && loadingSendPfd === false
                  }
                >
                  <AntDesign
                    name="pdffile1"
                    size={40}
                    color={colors.pdf_color}
                  />
                  <PdfText>...{pdfFile?.name?.substr(-9)}</PdfText>
                </If>

                <If condition={loadingSendPfd === true}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </If>
              </PdfWrapper>
            </InputContainer>

            <If
              condition={
                Object.keys(pdfFile).length > 0 && loadingSendPfd === false
              }
            >
              <Ionicons
                name="ios-remove-circle-sharp"
                color={colors.pdf_color}
                size={25}
                style={{marginLeft: 20, marginTop: RFValue(35)}}
                onPress={() => setPdfFile({})}
              />
            </If>
          </ContentPdfSend>

          <Attention>{translate('driverStatus.attention_pdf')}</Attention>

          <Button
            title={translate('driverStatus.button_send')}
            onPress={() => sendDocumentPdf()}
            small
            enabled={Object.keys(pdfFile).length > 0}
            loading={loadingSendPfd}
          />
        </If>

        <If condition={docConfig.image === '1'}>
          <ContentPhotoSend>
            <InputContainer label={translate('driverStatus.label_photo')}>
              <If condition={Object.keys(capturedPhoto).length === 0}>
                <PhotoWrapper onPress={() => setModalSelectTypePhoto(true)}>
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={40}
                    color={colors.primary}
                  />
                </PhotoWrapper>
              </If>

              <If condition={Object.keys(capturedPhoto).length > 0}>
                <PreviewPhoto source={{uri: capturedPhoto?.uri}} />
              </If>
            </InputContainer>

            <If
              condition={
                Object.keys(capturedPhoto).length > 0 &&
                loadingSendPfd === false
              }
            >
              <Ionicons
                name="ios-remove-circle-sharp"
                color={colors.pdf_color}
                size={25}
                style={{marginLeft: 20, marginTop: RFValue(35)}}
                onPress={() => setCapturedPhoto({})}
              />
            </If>
          </ContentPhotoSend>

          <Attention>{translate('driverStatus.attention_photo')}</Attention>

          <Button
            title={translate('driverStatus.button_send')}
            onPress={() => sendDocumentPhoto()}
            small
            enabled={Object.keys(capturedPhoto).length > 0}
            loading={loadingSendPicture}
          />
        </If>
      </Content>

      <Modal visible={visibleCamera}>
        <CapturePicture savePicture={onPhoto} />
      </Modal>

      <Modal visible={modalSelectTypePhoto} transparent>
        <ContainerModal>
          <ContentOptions>
            <ContentOptionsText>
              Deseja utilizar a Câmera ou Galeria?
            </ContentOptionsText>

            <ContentOptionsButtons>
              <Button title="Câmera" onPress={() => onCamera()} small />
              <Button title="Galeria" onPress={() => onGallery()} small />
            </ContentOptionsButtons>
            <Exit
              onPress={() => setModalSelectTypePhoto(false)}
              activeOpacity={1}
            >
              <AntDesign
                name="closecircleo"
                size={22}
                color={colors.primary}
                onPress={() => setModalSelectTypePhoto(false)}
              />
            </Exit>
          </ContentOptions>
        </ContainerModal>
      </Modal>
    </Container>
  );
}
