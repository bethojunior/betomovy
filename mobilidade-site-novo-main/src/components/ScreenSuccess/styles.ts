import styled from "styled-components";

export const Container = styled.div`
  .content-icon-success {
    text-align: center;
    img {
      width: 150px;
      margin: 1rem 0;
    }
  }

  .text-success {
    font-size: 28px;
    text-align: center;
    margin: 1rem 0;
  }

  .text-description {
    font-size: 20px;
    text-align: center;
  }

  .content-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 2rem 0;

    button:nth-child(1) {
      background: none;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
    }

    button {
      width: 100%;
      font-size: 18px;
      font-weight: bold;
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 360px;
      cursor: pointer;
      color: var(--color-white);
      background-color: var(--color-primary);
      transform: scale(0.9);

      &:hover {
        transform: scale(1);
        transition: all ease 0.4s;
      }
    }

    a {
      display: block;
      width: 100%;
      font-size: 18px;
      font-weight: bold;
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 360px;
      cursor: pointer;
      color: var(--color-white);
      background-color: var(--color-primary);
      transform: scale(0.9);
      text-decoration: none;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        transform: scale(1);
        transition: all ease 0.4s;
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;
