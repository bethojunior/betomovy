import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
  }

  h2 {
    max-width: 400px;
    width: 100%;
    font-size: 20px;
  }

  p {
    width: 100%;
    font-size: 1.2rem;
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
