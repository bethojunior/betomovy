import styled from "styled-components";

interface ButtonModalProps {
  color: string;
}

export const Container = styled.div``;

export const ButtonModal = styled.button<ButtonModalProps>`
  background-color: ${(props) => props.color};
  color: #ffffff;
  padding: 0.5rem 0.8rem;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  margin-left: 0.5rem;
  transform: scale(0.9);

  :hover {
    transition: all ease 0.3s;
    transform: scale(1);
  }
`;

export const ContentImage = styled.div`
  display: flex;
  justify-content: center;
`;

export const ImagePerfil = styled.img`
  width: 350px;
  border-radius: 5px;
`;
