import { useState } from 'react';
import { ActivityIndicator, Linking, Modal } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { nameApp } from '../../../../../../constantBuild/config';
import { customToast } from '../../../../../../utils/FlashMessage';
import { translate } from '../../../../../../client/locales';
import { IfoodService } from '../../../../context/Ifood/service';
import theme from '../../../../styles/theme';
import { Button } from '../../../Button';
import {
    AnimatedContainer,
    CardDescription,
    CardHeader,
    CardTitle,
    CodeContainer,
    LoadingContainer,
    ModalContainer,
    Overlay,
    TextButton,
    styles,
} from './styles';
import { DeliveryCodeModalProps } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCentral } from '../../../../api/apiCentral';

export const DeliveryCodeModal = ({
    visible,
    onClose,
    onCodeValidated,
    tripReference,
}: DeliveryCodeModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { validateCode } = IfoodService();

    const handleClose = async () => {
        await AsyncStorage.setItem('deliveryModalVisible', 'false');
        await AsyncStorage.removeItem('tripReference');
        onClose();
    };

    const validate = async (code: string) => {
        setLoading(true);
        try {
            const response = await validateCode(tripReference, code);

            if (response) {
                customToast(translate('codeIfood.text_code_validated_success'), 'success');
                await handleClose();
                onCodeValidated();
            } else {
                customToast(translate('codeIfood.text_code_invalid'), 'danger');
                AsyncStorage.setItem('ifoodButton', 'false');
            }
        } catch (error) {
            console.error(error);
            customToast(translate('codeIfood.text_code_validation_error'), 'danger');
            AsyncStorage.setItem('ifoodButton', 'false');
        } finally {
            setLoading(false);
        }
    };

    const onRequestCloseInternal = async () => {
        try {
            const response = await apiCentral.get('contact-support', {
                params: {
                    tripReference: tripReference,
                    app: nameApp,
                }
            });
            if (response.status === 200 && response.data.message) {
                Linking.openURL(response.data.message);
                await handleClose();
            } else {
                customToast(translate('toast.text_contact_support_error'), 'danger');
            }
        } catch {
            customToast(translate('toast.text_contact_support_error'), 'danger');
        }
    };
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Overlay>
                <ModalContainer>
                    <AnimatedContainer>
                        <CardHeader>
                            <CardTitle>Código de Entrega</CardTitle>
                        </CardHeader>
                        <CardDescription>
                            Por favor, insira o código fornecido pelo cliente.
                        </CardDescription>
                        <CodeContainer>
                            <OtpInput
                                type='numeric'
                                blurOnFilled={true}
                                numberOfDigits={4}
                                onFilled={validate}
                                focusColor={theme.colors.primary}
                                theme={{
                                    containerStyle: styles.otpContainer,
                                    pinCodeContainerStyle: styles.otpPinCode,
                                    pinCodeTextStyle: styles.otpCodeText,
                                }}
                            />
                        </CodeContainer>

                        {loading && (
                            <LoadingContainer>
                                <ActivityIndicator size={20} color={theme.colors.primaryText} />
                                <TextButton>VALIDANDO...</TextButton>
                            </LoadingContainer>
                        )}
                        <Button
                            small
                            title='Não consegui encontrar o cliente'
                            onPress={onRequestCloseInternal}
                            style={{
                                alignContent: 'center',
                                width: '100%',
                            }}
                        />
                    </AnimatedContainer>
                </ModalContainer>
            </Overlay>
        </Modal>
    );
};
