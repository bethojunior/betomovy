import styled from 'styled-components/native';

export const HeaderSchedule = styled.View`
  width: 100%;
  text-align: right;
  padding: ${({theme}) => theme.spacing.large}px
    ${({theme}) => theme.spacing.large}px;
  margin-top: ${({theme}) => theme.spacing.xslarge}px;
  background-color: ${({theme}) => theme.colors.white};
`;
