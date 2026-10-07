import { Radio } from "antd";

import Mask from "../../../../../../../services/Mask";
import { ContentInputs, InputText, LabelText } from "../../styles";
import { MoneyValueTypeInputProps } from "./types";

// Input de valor monetário + seletor %/$ — repete em Taxa de Imposto, Taxa
// Extra, Taxa de Serviço e Formas de Pagamento/Taxas.
export function MoneyValueTypeInput({
  label,
  value,
  onChangeValue,
  valueType,
  onChangeType,
  inputType = "text",
  autoComplete,
  radioGroupName,
}: MoneyValueTypeInputProps) {
  return (
    <ContentInputs>
      <LabelText>{label}</LabelText>
      <InputText
        type={inputType}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) =>
          onChangeValue(Mask.setMaskMoney(event.target.value))
        }
      />
      <Radio.Group
        value={valueType}
        onChange={(event) => onChangeType(event.target.value)}
        name={radioGroupName}
      >
        <Radio value="%">%</Radio>
        <Radio value="$">$</Radio>
      </Radio.Group>
    </ContentInputs>
  );
}
