import { Checkbox } from "antd";
import { RadioButton } from "./styles";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface Props {
  title: string;
  checked: boolean;
  onChange: (event: CheckboxChangeEvent) => void;
  id: string;
}

export const ContainerCheckbox = ({ title, checked, onChange, id }: Props) => {
  return (
    <RadioButton>
      <Checkbox checked={checked} id={id} onChange={onChange} />
      {title}
    </RadioButton>
  );
};
