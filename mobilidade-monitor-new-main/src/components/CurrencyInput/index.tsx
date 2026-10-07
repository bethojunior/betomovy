import { forwardRef, useImperativeHandle, useState } from "react";
import { Container, InputMask } from "./styles";
import Mask from "../../services/Mask";

interface Props {
  disabled: boolean;
  onValueChange: (value: string) => void;
  placeholder?: string;
}
export type CurrencyInputRef = {
  clear: () => void;
  getValue: (value: string) => string;
};

export const CurrencyInput = forwardRef<CurrencyInputRef, Props>(
  ({ disabled, onValueChange, placeholder }, ref) => {
    const [value, setValue] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const input = event.target.value;
        const formattedInput = Mask.setMaskMoney(event.target.value);
        onValueChange(input.replace(/\D/g, ""));
        setValue(formattedInput);
      } catch (e) {
        console.error(e);
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          setValue("");
        },
        getValue: () => {
          return value;
        },
      }),
      [value]
    );

    return (
      <Container>
        <InputMask
          type="text"
          ref={ref as React.RefObject<HTMLInputElement>}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "Valor da devolução"}
        />
      </Container>
    );
  }
);
