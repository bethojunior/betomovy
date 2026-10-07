import { CheckBox } from '../../../components/CheckBox';
import Preload from '../../../components/Preload';
import TermsBox from '../../../components/TermsBox';
import { translate } from '../../../locales';
import {
  ButtonNextTermsSpeedMob,
  ContentPage,
  ContentPageFooter,
  ContentPageScroll,
  TextNoticeTermsSpeedMob,
  Title,
} from '../styles';

interface TermsStepProps {
  width: number;
  loading: boolean;
  checkTerms: boolean;
  descriptionTerms: string;
  onCheckTerms: () => void;
  onAcceptTerms: () => void;
}

export function TermsStep({
  width,
  loading,
  checkTerms,
  descriptionTerms,
  onCheckTerms,
  onAcceptTerms,
}: TermsStepProps) {
  return (
    <ContentPage style={{ width }}>
      <ContentPageScroll>
        <Preload visible={loading} transparent={false} type="spinner" />
        <Title>{translate('modalTerms.title')}</Title>
        <TextNoticeTermsSpeedMob>
          {translate('welcomeSpeedmob.text_notice_terms')}
        </TextNoticeTermsSpeedMob>
        {descriptionTerms && <TermsBox contentTerms={descriptionTerms} />}
      </ContentPageScroll>
      <ContentPageFooter>
        <CheckBox
          colorText="#000000"
          checked={checkTerms}
          title={translate('welcomeSpeedmob.title_checkbox')}
          onCheck={onCheckTerms}
        />
        <ButtonNextTermsSpeedMob
          title={translate('welcomeSpeedmob.text_button_accept_terms')}
          disabled={!checkTerms}
          isDisabled={!checkTerms}
          onPress={onAcceptTerms}
        />
      </ContentPageFooter>
    </ContentPage>
  );
}
