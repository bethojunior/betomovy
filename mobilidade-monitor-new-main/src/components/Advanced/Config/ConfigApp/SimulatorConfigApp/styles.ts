import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  > img {
    width: 270px;
    height: 500px;
  }
`;

export const ContentMoldure = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    position: relative;
  }
`;

export const Buttons = styled.div`
  color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70px;
  cursor: pointer;
  transform: scale(0.8);

  :hover {
    transition: all ease-in-out 0.3s;
    transform: scale(1);
  }

  @media (max-width: 840px) {
    font-size: 50px;
  }
`;
