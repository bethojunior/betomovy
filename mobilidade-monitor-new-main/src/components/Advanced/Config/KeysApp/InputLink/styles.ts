import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.4rem 0.4rem 0.4rem 2rem;
  border-radius: 3px;
  border: 1px solid #bbbfc2;
`;

export const ContentLinkInput = styled.a`
  position: absolute;
  top: 0%;
  left: 0;
  background-color: #b1b4b8;
  border-radius: 3px 0 0 3px;
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff !important;
  cursor: pointer;
  text-decoration: none;
`;
