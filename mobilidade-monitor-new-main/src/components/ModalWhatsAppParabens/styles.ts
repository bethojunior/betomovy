import styled from "styled-components";

export const ModalBody = styled.div`
  padding: 8px 0 0;
`;

export const MessageBox = styled.div`
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 20px;
`;

export const MessageText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const MessageTextarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  max-height: 220px;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  resize: vertical;
  overflow-y: auto;
  background-color: #fff;

  &:hover {
    border-color: #40a9ff;
  }

  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.15);
  }
`;

export const EnviarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #25d366;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1da851;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #25d366;
    outline-offset: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;
