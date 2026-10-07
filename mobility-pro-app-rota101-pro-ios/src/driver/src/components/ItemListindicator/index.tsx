import {translate} from '../../../../client/locales';
import {
  Container,
  Content,
  ContentInfo,
  ContentType,
  Info,
  Month,
  Name,
  Title,
  Type,
} from './styles';

interface Props {
  date?: string;
  name?: string;
  type?: string;
}

export function ItemListindicator({date, name, type}: Props) {
  return (
    <Container>
      <Content>
        <ContentInfo>
          <Title>{translate('indicator.date_name')}</Title>

          <Info>
            <Month>{date} - </Month>
            <Name>{name} </Name>
          </Info>
        </ContentInfo>

        <ContentType>
          <Title>{translate('indicator.type')}</Title>
          <Type>{type}</Type>
        </ContentType>
      </Content>
    </Container>
  );
}
