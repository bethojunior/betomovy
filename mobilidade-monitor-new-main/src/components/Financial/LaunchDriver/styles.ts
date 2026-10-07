import { Button, Input } from "antd";
import styled from "styled-components";

interface ConfigReleaseProps {
  visible: boolean;
}

export const Content = styled.div`
  margin-left: 20px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ConfigReleaseDriverContent = styled.div<ConfigReleaseProps>`
  display: ${({ visible }) => (visible ? "block" : "none")};
  border: 1px solid #bbb8b8;
  padding: 0 10px 10px 10px;
  border-radius: 5px;
`;

export const Label = styled.p`
  margin-top: 10px;
  margin-bottom: 5px;
`;

export const Text = styled.p`
  margin-bottom: 0;
`;

export const Inputt = styled(Input)`
  width: 80px;
  margin-left: 10px;
`;

export const Buton = styled(Button)`
  border: none;
  text-align: initial;
`;
