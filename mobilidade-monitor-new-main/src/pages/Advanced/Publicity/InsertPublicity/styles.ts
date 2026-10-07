import styled from "styled-components";

import { theme_colors } from "../../../../theme/theme";
import { Spin, Button, Select, DatePicker } from "antd";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  background-color: ${theme_colors.white};
  padding: 1.5rem;
  border-radius: 5px;
  max-width: 1300px;
  width: 100%;

  @media (max-width: 950px) {
    max-width: 700px;
  }

  @media (max-width: 800px) {
    margin: 1rem;
  }
`;

export const ContentBannerAndLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentButtonLoadImg = styled.div`
  margin-top: 0.5rem;

  input[type="file"] {
    display: none;
  }

  .labelImg {
    display: inline-block;
    padding: 6px 12px;
    background-color: ${theme_colors.primary_antd};
    color: ${theme_colors.white};
    border-radius: 4px;
    cursor: pointer;
    transition: filter 0.3s;
    font-size: 14px;

    &:hover {
      filter: brightness(1.1);
    }
  }
`;

export const Input = styled.input`
  padding: 0.4rem 0.6rem;
  border-radius: 5px;
  border: 1px solid ${theme_colors.light_gray};
  width: 100%;
  font-size: 14px;
  transition: all ease 0.3s;

  &:hover {
    border: 1px solid ${theme_colors.primary_antd};
  }

  &:focus {
    border: 1px solid ${theme_colors.primary_antd};
  }
`;

export const ContentTwoColumns = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 950px) {
    flex-direction: column;

    > div {
      width: 100%;
    }
  }
`;

export const LabelText = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${theme_colors.black};
  font-size: 14px;
`;

export const ContentInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  > *:last-child {
    margin-bottom: 0;
  }
`;

interface ImageProps {
  $aspectRatio: string;
}

export const Image = styled.img<ImageProps>`
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid ${theme_colors.gray};
  background-color: ${theme_colors.light_gray};
  margin-top: 0.5rem;
`;

export const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${theme_colors.black};
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
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
  display: flex;
  gap: 1rem;
  max-width: 425px;
  width: 100%;

  @media (max-width: 950px) {
    justify-content: center;
  }
`;

export const MessageErrorInput = styled.span`
  display: block;
  margin: 0.5rem;
  font-size: 14px;
  color: ${theme_colors.red_crismon};
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;

export const ContentColumn = styled.div`
  flex: 1;
`;

export const ContentInputPadded = styled(ContentInput)`
  padding-right: 1rem;
`;

export const ContentInputFlex = styled(ContentInput)`
  flex: 1;
`;

export const FullWidthSelect = styled(Select)`
  width: 100%;
` as typeof Select;

export const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
` as typeof DatePicker;

export const SaveButton = styled(Button)`
` as typeof Button;

export const FormTextExtra = styled.p`
  margin-top: 0.5rem;
  font-size: 12px;
  color: ${theme_colors.gray};
`;