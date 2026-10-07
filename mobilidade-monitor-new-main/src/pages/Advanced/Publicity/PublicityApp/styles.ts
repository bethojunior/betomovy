import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";
import { Radio, Slider, Switch, Collapse } from "antd";
const { Panel } = Collapse;

export const Container = styled.div`
  height: 100vh;

  input[type="file"] {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ContentInput = styled.div`
  margin: 1rem 0;
`;

export const ContentBannerAndLabel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;


`;

export const ContentImgLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;

  @media (max-width: 1350px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ContainerButtonSave = styled.div`
  width: 100%;
  display: flex;
  margin: 2rem 0;

  @media (max-width: 950px) {
    justify-content: center;
  }
`;

export const ContentButtonSave = styled.div`
  max-width: 425px;
  width: 100%;

  @media (max-width: 950px) {
    text-align: center;
  }
`;

export const LabelText = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 1rem 0;

  @media (max-width: 520px) {
    font-size: 13px;
    text-align: center;
  }
`;

export const StyledImage = styled.img`
  width: 160px;
  height: 90px;
  border: 1px solid ${theme_colors.gray};

  @media (max-width: 1350px) {
    width: 120px;
    height: 80px;
  }
`;

export const ContentButtonLoadImg = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  .labelImg {
    width: 100%;
    padding: 0.5rem 0.8rem;
    background-color: ${theme_colors.light_gray};
    cursor: pointer;
    color: ${theme_colors.black};
    border-radius: 5px;

    &:hover {
      transition: all ease 0.3s;
      background-color: ${theme_colors.primary_antd};
      color: ${theme_colors.white};
    }
  }

  @media (max-width: 425px) {
    text-align: center;
  }
`;

export const StyledPanel = styled(Panel)``;

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledSlider = styled(Slider)`
  margin: 10px 0;
`;

export const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledSwitch = styled(Switch)``;
