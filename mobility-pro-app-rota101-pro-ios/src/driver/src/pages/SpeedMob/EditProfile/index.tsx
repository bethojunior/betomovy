import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Modal } from 'react-native';
import { useTheme } from 'styled-components';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImageManipulator from 'expo-image-manipulator';
import {
    Ball,
    ButtonEdit,
    Container,
    ContainerModal,
    ContentOptions,
    ContentOptionsButtons,
    ContentOptionsText,
    DriverName,
    Exit,
    Header,
    ImageContent,
    InfoContent,
    ItemTripType,
    ListTypeContent,
    Photo,
    SimpleText,
    TitleTripType,
    TripTypeContent,
    Content,
    TitleContent,
    ContentForms,
    ButtonBack,
    TitleHeader
} from './styles';
import apiMainDriver from '../../../api/apiMain';
import { FaceDetectorScreen } from '../../../components/FaceDetectorModal';
import EditProfileModal from '../../../components/Modal/EditProfileModal';
import { useUserDriver } from '../../../context/userDriver';
import Preload from '../../../../../client/components/Preload';
import { useAuth } from '../../../../../context/auth';
import { buildApp } from '../../../../../constantBuild/config';
import { customToast } from '../../../../../utils/FlashMessage';
import { Button } from '../../../components/Button';
import Helper from '../../../utils/Helper';

import { uploadDocument } from '../../../utils/pdf/upload';
import { translate } from '../../../../../client/locales';
import { useNavigation } from '@react-navigation/native';

import theme from '../../../styles/theme';

export default function EditProfileSpeedMob() {
    const [modalFaceDetector, setModalFaceDetector] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [typeEdit, setTypeEdit] = useState<'email' | 'password' | 'phone'>();
    const [loading, setLoading] = useState(false);

    const { userDriverFind } = useUserDriver();
    const { userDriver, generalSettings } = useAuth();
    const { colors } = useTheme();

    const navigation = useNavigation();

    async function sendPhotoRecognition(uri) {
        setModalEdit(false);
        setLoading(true);
        resizeImage(uri).then(result => {
            async function updatePhoto() {
                const locaUri = result.uri;
                const filename = locaUri.split('/').pop();

                // Infer the type of the image
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                const formData = new FormData();
                formData.append('driverId', userDriverFind.idDriver);
                formData.append('photo', {
                    // @ts-ignore
                    uri: result.uri,
                    type,
                    name: filename,
                });
                const {
                    data: { status },
                } = await apiMainDriver.post('Driver/EditProfileImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setLoading(false);

                if (!status) {
                    customToast('Erro ao atualizar sua foto, tente novamente', 'danger');
                }

                customToast('Foto enviada para avaliação, aguarde', 'success');
            }
            setModalFaceDetector(false);
            updatePhoto();
        });
    }

    async function resizeImage(uri) {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 512, height: 512 } }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG },
        );

        return manipResult;
    }

    const handleEditPhoto = (conditional: string) => {
        switch (conditional) {
            case '1':
                return setModalEdit(true);
            case '0':
                return setModalFaceDetector(true);
            default:
                return setModalFaceDetector(true);
        }
    };

    const onGallery = async () => {
        setModalEdit(false);
        const response = await uploadDocument('image/*');
        if (response.type === 'cancel') return;
        // @ts-ignore
        const manipulatedImage = await resizeImage(response.uri, 512, 512);
        const filename = manipulatedImage.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const typeImage = match ? `image/${match[1]}` : `image`;

        setCapturedImage({
            uri: manipulatedImage.uri,
            type: typeImage,
            name: filename,
        });

        await sendPhotoRecognition(manipulatedImage.uri);
    };

    return (
        <>
            <Preload visible={loading} />
            <Container>
                <Header backgroundColor={theme.colors.primary}>
                    <ButtonBack onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back' size={30} color={theme.colors.background_global} />
                    </ButtonBack>
                    <TitleHeader color={theme.colors.background_global}>
                        {translate('menu.text_edit_profile')}
                    </TitleHeader>
                </Header>
                <InfoContent>
                    <Content>
                        <TitleContent backgroundColor={theme.colors.primary} color={theme.colors.background_global}>Foto de perfil</TitleContent>
                        <TouchableOpacity
                            onPress={() =>
                                handleEditPhoto(
                                    generalSettings.find(
                                        item => item.key === 'enable_driver_open_gallery',
                                    ).value,
                                )
                            }
                        >
                            <Photo>
                                <ImageContent
                                    source={
                                        userDriverFind != null && {
                                            uri: `${buildApp().HOST_IMAGE_DRIVER}${userDriverFind?.profileImage
                                                }`,
                                        }
                                    }
                                />
                                <Feather name="edit" style={{ position: 'absolute' }} />
                            </Photo>
                        </TouchableOpacity>
                        <View style={{ margin: 30 }}>
                            <DriverName>{Helper.maskNames(userDriverFind?.name.trim())}</DriverName>
                            <SimpleText>{userDriverFind.document || ''}</SimpleText>
                        </View>
                    </Content>
                    <ContentForms>
                        <TitleContent backgroundColor={theme.colors.primary} color={theme.colors.background_global}>Alterar dados</TitleContent>
                        <ButtonEdit
                            activeOpacity={0.5}
                            onPress={() => {
                                setTypeEdit('email');
                                setEditModal(true);
                            }}
                        >
                            <SimpleText>Email:</SimpleText>
                            <View style={{ flexDirection: 'row' }}>
                                <SimpleText>{userDriver?.email || ''}</SimpleText>
                                <Feather
                                    style={{ marginLeft: 5, alignSelf: 'center' }}
                                    color={colors.secondary}
                                    name="edit"
                                />
                            </View>
                        </ButtonEdit>
                        <ButtonEdit
                            activeOpacity={0.5}
                            onPress={() => {
                                setTypeEdit('phone');
                                setEditModal(true);
                            }}
                        >
                            <SimpleText>Telefone:</SimpleText>
                            <View style={{ flexDirection: 'row' }}>
                                <SimpleText>{userDriverFind.phone || ''}</SimpleText>
                                <Feather
                                    style={{ marginLeft: 5, alignSelf: 'center' }}
                                    color={colors.secondary}
                                    name="edit"
                                />
                            </View>
                        </ButtonEdit>
                        <ButtonEdit
                            activeOpacity={0.5}
                            onPress={() => {
                                setTypeEdit('password');
                                setEditModal(true);
                            }}
                        >
                            <SimpleText>Senha:</SimpleText>
                            <View style={{ flexDirection: 'row' }}>
                                <SimpleText>******</SimpleText>
                                <Feather
                                    style={{ marginLeft: 5, alignSelf: 'center' }}
                                    color={colors.secondary}
                                    name="edit"
                                />
                            </View>
                        </ButtonEdit>
                    </ContentForms>
                    <TripTypeContent>
                        <TitleContent backgroundColor={theme.colors.primary} color={theme.colors.background_global}>
                            {translate('myProfile.title_trip_type')}
                        </TitleContent>

                        {userDriverFind?.tripTypes?.map(type => {
                            return (
                                <ListTypeContent key={type.tripTypeId}>
                                    <Ball backgroundColor={theme.colors.primary} />
                                    <ItemTripType> {type.tripType}</ItemTripType>
                                </ListTypeContent>
                            );
                        })}
                    </TripTypeContent>
                </InfoContent>
                <EditProfileModal
                    visible={editModal}
                    setVisible={setEditModal}
                    type={typeEdit}
                />
                <Modal visible={modalEdit} transparent>
                    <ContainerModal>
                        <ContentOptions>
                            <ContentOptionsText>
                                {translate('myProfile.do_you_want_to_use_camera_or_gallery')}
                            </ContentOptionsText>

                            <ContentOptionsButtons>
                                <Button
                                    backgroundColor={theme.colors.primary}
                                    color={theme.colors.background_global}
                                    title={translate('myProfile.text_cam')}
                                    onPress={() => setModalFaceDetector(true)}
                                    small
                                />
                                <Button
                                    backgroundColor={theme.colors.primary}
                                    color={theme.colors.background_global}
                                    title={translate('myProfile.text_gallery')}
                                    onPress={() => onGallery()}
                                    small
                                />
                            </ContentOptionsButtons>
                            <Exit onPress={() => setModalEdit(false)} activeOpacity={1}>
                                <AntDesign
                                    name="closecircleo"
                                    size={22}
                                    color={colors.primary}
                                    onPress={() => setModalEdit(false)}
                                />
                            </Exit>
                        </ContentOptions>
                    </ContainerModal>
                </Modal>
                <FaceDetectorScreen
                    visible={modalFaceDetector}
                    onClose={() => setModalFaceDetector(false)}
                    sendPhoto={() => sendPhotoRecognition(capturedImage.uri)}
                    setImage={setCapturedImage}
                />
            </Container>
        </>
    );
}
