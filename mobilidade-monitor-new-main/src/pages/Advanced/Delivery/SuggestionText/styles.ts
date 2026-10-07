import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";
import { Spin } from 'antd';

export const Container = styled.form`
  background-color: ${theme_colors.white};
  padding: 1.5rem;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  margin-bottom: 4rem;
`;

export const ContentInput = styled.div`
  margin: 1rem 0;
`;

export const LabelInput = styled.label`
  font-size: 16px;
  margin-bottom: 0.5rem;
  display: block;
`;

export const MessageError = styled.span`
  display: block;
  font-size: 14px;
  color: ${theme_colors.red_crismon};
  margin: 0.5rem 0;
`;

export const ContentButton = styled.div``;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;
