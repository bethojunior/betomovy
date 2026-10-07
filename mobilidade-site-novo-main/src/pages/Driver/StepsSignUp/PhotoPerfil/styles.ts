import styled from "styled-components";

export const Container = styled.div`
  h1 {
    font-size: 30px;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .content-photo-perfil {
    margin: 1rem 0;
  }

  .content-photo-perfil .input-file {
    display: flex;
    justify-content: center;
  }

  .content-photo-perfil .input-file label {
    display: block;
    width: 300px;
    height: 300px;
    cursor: pointer;
    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }

  .content-photo-perfil .input-file input {
    display: none;
  }

  .animate-spin {
  animation: spin 1s linear infinite;
}

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .content-photo-perfil .content-button {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 1rem 0;

    button:nth-child(1) {
      background: none;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
    }

    button {
      width: 100%;
      font-size: 20px;
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
`;
