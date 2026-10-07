import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  h1 {
    max-width: 400px;
    width: 100%;
    font-size: 45px;
    font-weight: bold;
    color: red;
  }

  h2 {
    max-width: 400px;
    width: 100%;
    font-size: 20px;
  }

  p {
    width: 100%;
    font-size: 26px;
    font-weight: bold;
  }

  > div:nth-child(2) {
    position: relative;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;

    h1 {
      font-size: 35px;
    }

    p {
      font-size: 20px;
    }

    h2 {
      font-size: 16px;
    }
  }
`;

export const ContentAnimationRouteMaps = styled.div``;

export const ContentAnimationFailed = styled.div`
  position: absolute;
  top: 35%;
  left: 30%;
`;

export const Link = styled.span`
  font-size: 18px;
`;
