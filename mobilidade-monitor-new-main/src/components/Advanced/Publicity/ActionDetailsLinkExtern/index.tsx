import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  CheckBoxContainer,
  CheckBoxLabel,
  ContentInput,
  LabelText,
  TextArea,
} from "./styles";
import { Checkbox } from "antd";

export const ActionDetailsLinkExtern = forwardRef<
  CheckMethodRef,
  ActionLinkExternalProps
>(({ idActionType, setIdActionType, datas }, ref) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const optionsCheckbox = [
    {
      id: 1,
      label: "Direcionar direto",
    },
    {
      id: 2,
      label: "Abrir dentro do app (Webview)",
    },
    {
      id: 3,
      label: "Abrir interação com a imagem",
    },
  ];

  useImperativeHandle(ref, () => ({
    getTextImg() {
      return textAreaRef.current?.value || textAreaRef.current?.defaultValue;
    },
  }));

  return (
    <>
      <ContentInput>
        <LabelText>Opções de ação no link:</LabelText>
        {optionsCheckbox.map((value) => {
          return (
            <CheckBoxContainer key={value.id}>
              <Checkbox
                checked={value.id === idActionType}
                onChange={(event) => {
                  setIdActionType(event.target.checked ? value.id : 0);
                }}
              />
              <CheckBoxLabel
                key={value.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {value.label}
              </CheckBoxLabel>
            </CheckBoxContainer>
          );
        })}
      </ContentInput>

      {idActionType === 3 && (
        <ContentInput>
          <TextArea
            placeholder="Descritivo de tela (Aparecerá embaixo da imagem)"
            defaultValue={datas?.textImage}
            ref={textAreaRef}
          />
        </ContentInput>
      )}
    </>
  );
});
