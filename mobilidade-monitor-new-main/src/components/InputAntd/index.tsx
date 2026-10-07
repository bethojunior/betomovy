import { Input, InputProps } from "antd";

import { Container, MessageError } from "./styles";

interface InputAntdProps extends InputProps {
  messageError?: string;
}

export const InputAntd = ({ messageError, ...props }: InputAntdProps) => {
  return (
    <Container>
      <Input {...props} />
      {messageError && <MessageError>{messageError}</MessageError>}
    </Container>
  );
};
