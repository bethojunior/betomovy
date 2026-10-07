import { Button, Popover } from "antd";
import { IoMdHelpCircle } from "react-icons/io";

import { Container } from "./styles";

interface PopoverHelperProps {
  title: string;
  description?: string | undefined;
}

export const PopoverHelper = ({ title, description }: PopoverHelperProps) => {
  return (
    <Container>
      <Popover
        placement="bottomLeft"
        title={title}
        content={description ? description : ""}
        overlayStyle={{
          width: 300,
        }}
      >
        <Button icon={<IoMdHelpCircle />} />
      </Popover>
    </Container>
  );
};
