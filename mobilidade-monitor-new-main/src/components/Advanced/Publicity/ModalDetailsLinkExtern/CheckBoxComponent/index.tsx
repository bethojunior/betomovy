import { Checkbox } from "antd";
import { CheckBoxContainer, CheckBoxLabel, LabelText } from "../styles";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { CheckboxChangeEvent, CheckboxRef } from "antd/es/checkbox";

export const CheckBoxComponent = forwardRef<
  CheckBoxComponentRefProps,
  CheckBoxComponentProps
>(({ label, title, defaultChecked }, ref) => {
  const [checked, setChecked] = useState(defaultChecked || false);
  const checkboxRef = useRef<CheckboxRef | null>(null);

  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        getChecked: () => {
          return checked;
        },
        setCheckedData: (value: boolean) => {
          setChecked(value);
        },
      };
    },
    [checked]
  );

  return (
    <>
      {label && <LabelText>{label}</LabelText>}
      <CheckBoxContainer>
        <Checkbox
          ref={checkboxRef}
          checked={checked}
          onChange={(e) => onChange(e)}
        />
        <CheckBoxLabel
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {title}
        </CheckBoxLabel>
      </CheckBoxContainer>
    </>
  );
});
