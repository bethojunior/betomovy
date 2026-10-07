import { Modal } from "react-native";
import { IModalLowBatteryTravelOptions } from "./types";
import { Container, ContentModal, TitleModal, DescriptionModal, ContentButton, LabelButton, IconMocal } from "./styles";
import theme from "~/client/styles/theme";
import { ButtonView } from "~/client/components/ButtonView";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { translate } from "~/client/locales";
import lowBatteryImage from '~/assets/fox-turbo.webp';

export function ModalLowBatteryTravelOptions({ visible, setVisible, handleTurbine }: IModalLowBatteryTravelOptions) {
    const handleCloseModal = () => {
        setVisible(false);
    }

    const handleActiveTurbeMode = async () => {
        await handleTurbine();
        handleCloseModal();
    }

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={handleCloseModal}
        >
            <Container>
                <ContentModal>
                    <IconMocal source={lowBatteryImage} />

                    <TitleModal>{translate('modalLowBatteryTravelOptions.title')}</TitleModal>

                    <DescriptionModal>
                        {translate('modalLowBatteryTravelOptions.description')}
                    </DescriptionModal>

                    <DescriptionModal
                        colorText={theme.colors.black}
                        fontBold
                    >
                        {translate('modalLowBatteryTravelOptions.highlight')}
                    </DescriptionModal>

                    <ContentButton>
                        <LabelButton>{translate('modalLowBatteryTravelOptions.turboLabel')}</LabelButton>
                        <ButtonView
                            textColor={theme.colors.primaryText}
                            backgroundColor={theme.colors.border_green}
                            iconButton={<MaterialCommunityIcons name="rocket-launch" size={30} color={theme.colors.white} />}
                            fullWidth
                            onPress={handleActiveTurbeMode}
                        >
                            {translate('modalLowBatteryTravelOptions.turboButton')}
                        </ButtonView>
                    </ContentButton>

                    <ContentButton>
                        <LabelButton>{translate('modalLowBatteryTravelOptions.normalLabel')}</LabelButton>
                        <ButtonView
                            fullWidth
                            onPress={handleCloseModal}
                        >
                            {translate('modalLowBatteryTravelOptions.continueButton')}
                        </ButtonView>
                    </ContentButton>
                </ContentModal>
            </Container>
        </Modal>
    )
}
