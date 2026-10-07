import { Select, SelectProps } from "antd";

import { Container, MessageError } from "./styles";

interface SelectAntdProps extends SelectProps {
  messageError?: string;
}

export const SelectAntd = ({ messageError, ...props }: SelectAntdProps) => {
  return (
    <Container>
      <Select
        style={{
          width: "100%",
        }}
        {...props}
      />
      {messageError && <MessageError>{messageError}</MessageError>}
    </Container>
  );
};
