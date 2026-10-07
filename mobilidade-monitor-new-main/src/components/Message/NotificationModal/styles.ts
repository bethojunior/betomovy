import { Button, Form, Upload } from "antd";
import styled from "styled-components";

export const FormItem = styled(Form.Item)`
  margin: 4px;
`;

export const File = styled(Upload)`
  .ant-tooltip-content {
    display: none;
  }
`;

export const FooterModal = styled.div`
  display: flex; 
  justify-content: flex-end;
`;

export const FooterModalButton = styled(Button)`
  margin: 10px;
  margin-bottom: 0px
`;