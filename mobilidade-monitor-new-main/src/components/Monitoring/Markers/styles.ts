import styled, { keyframes } from "styled-components";


export const ImagePointer = styled.img`
  width: 25px;
  height: 25px;
  
`;
const animation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0.7;
  }
`;

export const ImageCustomer = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ebb513;
  animation: ${animation} 1s none infinite;
`;

export const StartImageStyle = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 20px;
`;
