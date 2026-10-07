import {TextSize} from '../../pages/Transfer/styles';
import {ContainerInfo, TextTitle} from './styles';

interface Props {
  title: string;
  data: string;
}
export const TextComponent = ({title, data}: Props) => {
  return (
    <ContainerInfo>
      <TextTitle>{title}</TextTitle>
      <TextSize>{data}</TextSize>
    </ContainerInfo>
  );
};
