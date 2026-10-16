import { Container, TitlePage, Form, Label, ContentInput, ContentButton } from "./styles";
import { Modal } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRef } from "react";
import FlashMessage from 'react-native-flash-message';
import InputForm from "../../components/form/InputForm";

import { IConfirmationAccountAppPartnerProps } from "./types";
import { useConfirmationAccountAppPartner } from "./useConfirmationAccountAppPartner";
import { ButtonView } from "../../components/ButtonView";
import { CustomFlashMessage } from "../../../components/CustomFlashMessage";
import theme from "../../styles/theme";
import { translate } from "../../locales";

export default function ConfirmationAccountAppPartner({ visible, setVisible }: IConfirmationAccountAppPartnerProps) {
    // <Modal> do RN abre numa camada nativa própria — o <FlashMessage> global do App.tsx não aparece por cima dela,
    // por isso essa instância local (não registrada como default, pra não roubar os toasts do resto do app)
    const flashMessageRef = useRef<FlashMessage>(null);

    const showToast = (message: string, type: 'warning' | 'danger') => {
        flashMessageRef.current?.showMessage({
            message: '',
            description: message,
            type,
            hideOnPress: true,
            duration: 3500,
            floating: true,
        });
    };

    const {
        handleCloseModal,
        control,
        errors,
        onSubmit,
        isLoadingState
    } = useConfirmationAccountAppPartner({ setVisible, showToast })

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Modal
                    animationType="slide"
                    visible={visible}
                    onRequestClose={handleCloseModal}
                >
                    <Container>
                        <FlashMessage
                            ref={flashMessageRef}
                            canRegisterAsDefault={false}
                            MessageComponent={CustomFlashMessage}
                            position="top"
                            floating
                        />

                        <TitlePage>
                            {translate("modal_confirm_account_app_partner.title_page")}
                        </TitlePage>

                        <Form>
                            <ContentInput>
                                <Label>
                                    {translate("modal_confirm_account_app_partner.label_email")}
                                </Label>
                                <InputForm
                                    name="email"
                                    control={control}
                                    error={errors.email?.message}
                                    keyboardType="default"
                                    placeholder="jhondoe@email.com"
                                />
                            </ContentInput>

                            <ContentButton>
                                <ButtonView
                                    onPress={onSubmit}
                                    backgroundColor={theme.colors.primary}
                                    textColor={theme.colors.primaryText}
                                    isLoading={isLoadingState}
                                >
                                    {translate("modal_confirm_account_app_partner.text_verify_button")}
                                </ButtonView>

                                <ButtonView
                                    onPress={handleCloseModal}
                                    transparent
                                    backgroundColor={theme.colors.primary}
                                    textColor={theme.colors.primary}
                                    disabled={isLoadingState}
                                >
                                    {translate("modal_confirm_account_app_partner.text_close_button")}
                                </ButtonView>
                            </ContentButton>
                        </Form>
                    </Container>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
