import styled from "styled-components";

interface ContainerProps {
  backgroundApp: string | undefined;
  colorSwitch: string | undefined;
}

interface ContentItemProps {
  colorItem: string | undefined;
  colorBorder: string | undefined;
}

export const Container = styled.div<ContainerProps>`
  width: 292px;
  position: absolute;
  height: 91.6%;
  top: 2.5rem;
  border-radius: 0 0 30px 30px;
  background-color: ${({ backgroundApp }) => backgroundApp};

  .ant-switch.ant-switch-small.ant-switch-checked {
    background-color: ${({ colorSwitch }) => colorSwitch};
  }
`;

export const HeaderConfig = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

export const ContentIconHeader = styled.div`
  font-size: 18px;
  cursor: pointer;
  position: relative;
`;

export const BeadgeBell = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 360px;
  background-color: red;
  border: none;
  position: absolute;
  right: 0;
`;

export const ContentCard = styled.div<{ colorBorder: string | undefined }>`
  border: 1px solid ${({ colorBorder }) => colorBorder};
  border-radius: 5px;
`;

export const HeaderCard = styled.div<{ backgrounButton: string | undefined }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: ${({ backgrounButton }) => backgrounButton};
  padding: 0.4rem;
  font-size: 12px;
  font-weight: bold;
`;

export const BodyCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  height: 91.5%;
  border-radius: 0 0 30px 30px;
  padding: 0 0.5rem;
  padding-bottom: 2rem;
`;

export const ContentItem = styled.div<ContentItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  border-bottom: 1px solid ${({ colorBorder }) => colorBorder};
  color: ${({ colorItem }) => colorItem};
  font-size: 12px;
`;

export const ButtonItem = styled.button<{
  backgrounButton: string | undefined;
}>`
  font-size: 12px;
  border-radius: 3px;
  width: 55px;
  height: 25px;
  background-color: ${({ backgrounButton }) => backgrounButton};
  border: none;
`;

export const ContentIcon = styled.div<{ colorIcon: string | undefined }>`
  color: ${({ colorIcon }) => colorIcon};
  font-size: 14px;
`;

export const TitleHeaderItem = styled.div<{ colorTitle: string | undefined }>`
  color: ${({ colorTitle }) => colorTitle};
`;
