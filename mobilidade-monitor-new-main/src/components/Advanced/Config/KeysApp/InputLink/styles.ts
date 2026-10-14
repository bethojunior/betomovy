import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  height: 38px;
  padding: 6px 12px 6px 36px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #1e293b;
  font-size: 13.5px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0284c7;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ContentLinkInput = styled.a`
  position: absolute;
  top: 1px;
  bottom: 1px;
  left: 1px;
  background-color: #f1f5f9;
  border-radius: 5px 0 0 5px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #64748b !important;
  cursor: pointer;
  text-decoration: none;
  border-right: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
    color: #0f172a !important;
  }
`;
