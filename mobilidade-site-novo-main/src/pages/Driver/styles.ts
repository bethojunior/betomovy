import styled from "styled-components";

export const Container = styled.div`
  .content-driver {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
  }

  .content-driver .column-1 {
    img {
      width: 250px;
      border-radius: 8px;
    }
    h1 {
      font-size: 50px;
      color: var(--color-white);
      margin: 2rem 0;
    }
    span {
      width: 70%;
      display: block;
      font-size: 25px;
      color: var(--color-white);
      font-weight: lighter;
    }
  }

  .content-driver .column-2 {
    position: relative;
    max-width: 600px;
    width: 100%;
    background-color: var(--color-white);
    padding: 1.5rem;
    border-radius: 10px;
    align-self: flex-start;
    margin: 2rem 0;
  }

  .content-driver .column-2 .form-terms {
    font-size: 0.75rem;
    margin: 0.5rem 0;
    color: #555;
  }

  .content-driver .column-2 .content-category {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    max-height: 500px;
    overflow: auto;
  }

  .content-driver .column-2 .content-category > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--color-black);
    padding: 0.8rem;
    border-radius: 5px;
    transform: scale(0.95);

    &:hover {
      transition: all ease 0.3s;
      border: 1px solid #e48534;
      transform: scale(1);
    }
  }

  .content-driver
    .column-2
    .content-category
    > div
    .content-description-category {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .content-driver
    .column-2
    .content-category
    > div
    .content-description-category
    h3 {
    font-size: 20px;
  }

  .content-driver
    .column-2
    .content-category
    > div
    .content-description-category
    img {
    width: 50px;
  }

  .content-driver .column-2 .content-category > div .content-icon-arrow img {
    width: 15px;
  }

  /* SCREEN SUCCESS */
  .content-success-screen .content-icon-success {
    text-align: center;
    img {
      width: 150px;
      margin: 1rem 0;
    }
  }

  .content-success-screen .text-success {
    font-size: 28px;
    text-align: center;
    margin: 1rem 0;
  }

  .content-success-screen .text-description {
    font-size: 20px;
    text-align: center;
  }

  .content-success-screen .content-buttons {
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
  }

  @media (max-width: 1024px) {
    .content-driver {
      flex-direction: column;
      align-items: center;
    }

    .content-driver .column-1 {
      text-align: center;

      h1 {
        text-align: center;
        color: var(--color-white);
        margin: 2rem 0;
      }
      span {
        width: 100%;
        text-align: center;
        margin-bottom: 1rem;
      }
    }

    .content-driver .column-2 {
      max-width: none;
      width: 100%;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    .content-driver .column-1 {
      img {
        width: 150px;
      }

      text-align: center;

      h1 {
        font-size: 45px;
      }
      span {
        font-size: 18px;
      }
    }

    .content-driver .column-2 {
      background-color: var(--color-white);
      padding: 1.5rem;
      border-radius: 10px;
      width: 100%;

      form > h1 {
        font-size: 35px;
      }

      form input {
        font-size: 16px;
      }

      form select {
        font-size: 16px;
      }
    }
  }

  @media (max-width: 500px) {
    .content-driver {
      padding: 2rem 1rem;
    }

    .content-driver .column-1 {
      h1 {
        font-size: 35px;
      }
    }

    .content-driver .column-2 {
      background-color: var(--color-white);
      padding: 1.5rem;
      border-radius: 10px;

      form > h1 {
        font-size: 30px;
      }

      form input {
        font-size: 14px;
      }

      form select {
        font-size: 14px;
      }
    }

    .content-driver .column-2 .erros-input {
      font-size: 14px;
      color: red;
    }
  }
`;
