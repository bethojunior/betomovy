import styled from "styled-components";
import { colors } from "../../theme/colors";

export const Container = styled.div<{ isOpen: boolean }>`
  .content-nav {
    position: absolute;
    z-index: 1000;
    background-color: ${colors.white};
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    height: 100vh;
    border-radius: 0 5px 5px 0px;
    -webkit-box-shadow: 0px 0px 10px 0px ${colors.black_transparency};
    -moz-box-shadow: 0px 0px 10px 0px ${colors.black_transparency};
    box-shadow: 0px 0px 10px 0px ${colors.black_transparency};
    overflow: hidden;
    transition: height 0.3s ease;

    @media (max-width: 768px) {
      max-width: 100%;
      height: 300px;
      padding: 1rem;
      height: ${({ isOpen }) => (isOpen ? "300px" : "0")};
    }
  }

  .content-nav .content-logo {
    transition: opacity 0.3s;
    opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};

    img {
      width: 60px;
      border-radius: 5px;
      -webkit-box-shadow: 0px 0px 5px 0px ${colors.black_transparency};
      -moz-box-shadow: 0px 0px 5px 0px ${colors.black_transparency};
      box-shadow: 0px 0px 5px 0px ${colors.black_transparency};
    }

    @media (max-width: 768px) {
      text-align: end;
      img {
        width: 40px;
      }
    }
  }

  .content-nav .title-status {
    font-size: 24px;
    font-weight: 400;
  }

  .content-nav .content-travel {
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: opacity 0.3s;
    opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .content-nav .content-travel .content-addresses {
    display: flex;
    height: 100px;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    margin: 4rem 0;

    small {
      display: block;
      margin-bottom: 0.5rem;
      color: ${colors.gray};
    }

    @media (max-width: 768px) {
      margin: 0.5rem 0;
    }

    @media (max-width: 425px) {
      font-size: 12px;
    }
  }

  .content-nav .content-travel .content-icons-origin-and-destiny {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .ball {
    width: 10px;
    height: 10px;
    background-color: ${colors.black};
    border-radius: 360px;
  }

  .retangule {
    width: 5px;
    height: 80px;
    background-color: ${colors.black};

    @media (max-width: 425px) {
      height: 70px;
    }
  }

  .squad {
    width: 10px;
    height: 10px;
    background-color: ${colors.black};
  }

  .container-driver {
    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      margin: 1rem 0;
    }

    @media (max-width: 425px) {
      .name-driver {
        font-size: 14px;
      }
    }
  }

  .content-informations-driver {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .content-informations-driver .content-driver-photo {
    > img {
      width: 50px;
      height: 50px;
      border-radius: 360px;
    }

    @media (max-width: 425px) {
      > img {
        width: 40px;
        height: 40px;
      }
    }
  }

  .content-informations-driver .information-driver {
    .plate-car {
      font-size: 18px;
      font-weight: bold;
    }

    @media (max-width: 425px) {
      .plate-car {
        font-size: 16px;
      }

      .name-car {
        font-size: 14px;
      }
    }
  }

  .name-driver {
    text-align: center;
    width: 100%;
    display: block;
    margin: 0.5rem 0;
    font-weight: bold;
  }

  .content-share-register-stack {
    position: absolute;
    z-index: 1000;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.75rem;
    max-width: min(360px, calc(100% - 2rem));
    pointer-events: none;

    > * {
      pointer-events: auto;
    }

    @media (max-width: 768px) {
      top: auto;
      bottom: 0;
      left: 0;
      right: 0;
      align-items: center;
      max-width: 100%;
      padding: 0 0.5rem 0.35rem;
      box-sizing: border-box;
    }

    .content-btn-register {
      position: static;
      margin: 0;
      width: auto;

      @media (max-width: 768px) {
        display: flex;
        justify-content: center;
        width: 100%;
      }
    }
  }

  .content-btn-register {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    margin: 1rem;

    > a {
      display: block;
      background-color: ${colors.black};
      color: ${colors.white};
      padding: 0.8rem 1rem;
      font-size: 16px;
      font-weight: bold;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      text-decoration: none;
    }

    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
      width: 100%;
      text-align: center;
      top: auto;
      left: auto;
      bottom: 0;
      margin: 0.3rem 0.5rem;

      > a {
        font-size: 14px;
      }
    }
  }

  .content-btn-show-informations-trip {
    display: none;

    @media (max-width: 768px) {
      transition: top 0.3s ease;
      position: absolute;
      z-index: 1000;
      left: 0;
      top: ${({ isOpen }) => (isOpen ? "280px" : "15px")};
      width: 100%;
      display: flex;
      justify-content: center;

      button {
        font-size: 30px;
        background: none;
        border: none;
      }
    }
  }
`;
