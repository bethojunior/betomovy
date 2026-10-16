import { JSX } from 'react';
import {ContainerCard, Input, TextDescription, TextTitle} from './styles';

interface Props {
  value: string;
  description: string;
  editable?: boolean;
  setValue?: (value: string) => void;
  input?: JSX.Element;
}
export const CardVehicle = ({
  value,
  description,
  editable,
  setValue,
  input,
}: Props) => {
  return (
    <ContainerCard pointerEvents={editable ? 'box-none' : 'none'}>
      <TextDescription>{description}</TextDescription>
      {input ? (
        input
      ) : (
        <Input
          editable={editable}
          onChangeText={e => setValue(e)}
          value={value}
        />
      )}
      {/* <TextTitle>{value}</TextTitle> */}
    </ContainerCard>
  );
};
