import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px;
  width: 100%;
  background-color: var(--color-white);
  padding: 4rem;
  border-radius: 8px;

  .content-links-application {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    > div {
      a {
        width: 325px;
        display: block;
        text-decoration: none;
        font-size: 24px;
        background-color: var(--color-primary);
        padding: 1rem;
        color: var(--color-white);
        text-align: center;
        border-radius: 5px;
        transform: scale(1);

        &:hover {
          transition: all ease 0.3s;
          transform: scale(1.1);
        }
      }
    }
  }

  .content-links-application .content-button-close-modal {
    button {
      position: absolute;
      right: 0;
      top: 0;
      margin: 1rem;
      cursor: pointer;
      background: none;
      border: none;
    }
  }

  @media (max-width: 768px) {
    width: 95%;

    .content-links-application {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 480px) {
    padding: 2rem;

    .content-links-application {
      > div {
        a {
          width: 240px;
          font-size: 16px;
        }
      }
    }
  }
`;
