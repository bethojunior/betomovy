import {translate} from '../../../../client/locales';
import {
  Container,
  Content,
  ContentInfo,
  SubTitle,
  SubValue,
  Title,
  TitleLeft,
  Value,
  Wapper,
} from './styles';

interface CardTicketProps {
  title?: string;
  subTitle?: string;
  titleLeft?: string;
  value?: string;
  onPress?: () => void;
  itemSelected?: boolean;
}

export function CardTicket({
  subTitle,
  title,
  titleLeft,
  value,
  onPress,
  itemSelected,
}: CardTicketProps) {
  return (
    <Container onPress={onPress} activeOpacity={1} selected={itemSelected}>
      <Content selected={itemSelected}>
        <TitleLeft>{titleLeft}</TitleLeft>
      </Content>

      <Wapper>
        <ContentInfo>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
        </ContentInfo>

        <ContentInfo>
          <SubValue>{translate('prepaidDriver.just')}</SubValue>
          <Value>R$ {value}</Value>
        </ContentInfo>
      </Wapper>
    </Container>
  );
}
