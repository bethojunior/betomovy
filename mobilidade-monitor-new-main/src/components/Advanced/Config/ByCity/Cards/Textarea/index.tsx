import { Input } from "antd";
import { FC, useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import {
  Card,
  FirstColumn,
  Label,
  SecondColumn,
} from "../../../../../../pages/Advanced/Configs/ConfigByCities/styles";
import { CardTextareaProps } from "./types";
import { SaveButton } from "./styles";

const CardTextarea: FC<CardTextareaProps> = ({ item, onSearch }) => {
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    setTextValue(String(item.value ?? ""));
  }, [item]);

  return (
    <Card>
      <FirstColumn>
        <Label>{item.description}</Label>
      </FirstColumn>
      <SecondColumn>
        <Input.TextArea
          rows={6}
          value={textValue}
          placeholder="Use {firstName} e {projectName} como placeholders"
          onChange={(event) => setTextValue(event.target.value)}
        />
        <SaveButton
          type="primary"
          icon={<MdCheck />}
          onClick={() => onSearch(textValue, item.attribute, item.inputType)}
        >
          Salvar
        </SaveButton>
      </SecondColumn>
    </Card>
  );
};

export default CardTextarea;
