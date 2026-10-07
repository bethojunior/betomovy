import styled from "styled-components";
import { theme_colors } from "../../../theme/theme";

export const Container = styled.div``;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0 0 1rem;
`;

export const ContentTable = styled.div`
  width: 100%;
  overflow: auto;

  td {
    background-color: ${theme_colors.white};
  }

  .ant-table-thead > tr > th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme_colors.light_gray} !important;
    border-radius: 5px !important;
  }
`;

export const ContactCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
`;

export const PhoneText = styled.span`
  font-size: 13px;
  color: ${theme_colors.gray};
  white-space: nowrap;
`;

export const ContentBtnActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const WhatsAppButton = styled.a`
  width: 32px;
  height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #25d366;
  color: ${theme_colors.white};
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #128c7e;
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: ${theme_colors.gray};

  svg {
    font-size: 40px;
    margin-bottom: 0.75rem;
    color: ${theme_colors.light_gray};
  }

  span {
    font-size: 16px;
  }
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;
