import styled from "styled-components";

export const Container = styled.div`
  .content-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-white);
    padding: 0 3rem;
  }

  .content-nav .content-links {
    display: flex;
    gap: 35px;
    align-items: center;
    list-style: none;

    li {
      font-size: 18px;
      font-weight: bold;
    }

    li a {
      text-decoration: none;
      color: var(--color-black);

      &:hover {
        transition: all ease 0.3s;
        color: var(--color-primary);
      }
    }

    .content-button-links {
      button {
        animation: pulse 1s ease-in-out;
        animation-iteration-count: infinite;
        font-size: 20px;
      }
    }

    .content-button-translations {
      button {
        background: none;
        border: none;
        cursor: pointer;
        transform: scale(0.9);

        &:hover {
          transition: all ease 0.3s;
          transform: scale(1);
        }
      }
    }
  }

  .content-nav .content-logo {
    display: flex;
    align-items: center;
    gap: 15px;
    
    img {
      width: 100px;
    }
    
    .project-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-black);
      text-transform: capitalize;
      white-space: nowrap;
    }
  }

  .content-nav .content-button-nav-mobile {
    display: none;
  }

  .content-nav-mobile {
    width: 300px;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0px;
    background-color: #3f3f3fec;
    padding: 2rem;

    nav {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      flex-direction: column;

      > button {
        margin-bottom: 4rem;
        border: 1px solid var(--color-black);
        border-radius: 40px;
        padding: 0.4rem 0.5rem;
        background: linear-gradient(
          0deg,
          var(--color-primary) 0%,
          var(--color-secondary) 100%
        );
      }

      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 30px;

        li {
          font-size: 24px;
          color: var(--color-white);
          text-align: end;

          a {
            text-decoration: none;
            color: var(--color-white);
          }

          button {
            font-size: 20px;
            font-weight: bold;
            border: none;
            background: none;
            color: var(--color-white);
          }
        }
      }
    }
  }

  @media (max-width: 986px) {
    .content-nav {
      padding: 0 2rem;
    }

    .content-nav .content-links {
      gap: 30px;

      li {
        font-size: 16px;
      }
    }

    .content-nav .content-logo {
      img {
        width: 70px;
      }
      
      .project-name {
        font-size: 1rem;
      }
    }
  }

  @media (max-width: 768px) {
    .content-nav .content-button-nav-mobile {
      display: block;

      button {
        background: none;
        border: none;
      }
    }

    .content-nav .content-links {
      display: none;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;
