import styled from "styled-components";

export const Container = styled.div`
  .driverDataContainer {
    border: 1px solid #d8d8d8;
    margin: 0px 10px 10px 10px;
    padding: 10px;
  }

  .content-travel {
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: opacity 0.3s;
    margin-top: -50px;
  }

  .content-icons-origin-and-destiny {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 20px;
  }

  .ball {
    width: 10px;
    height: 10px;
    background-color: #000;
    border-radius: 360px;
  }

  .retangule {
    width: 5px;
    height: 80px;
    background-color: #000;

    @media (max-width: 425px) {
      height: 70px;
    }
  }

  .squad {
    width: 10px;
    height: 10px;
    background-color: #000;
  }

  .content-addresses {
    display: flex;
    height: 100px;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    margin: 4rem 0;

    small {
      display: block;
      margin-bottom: 0.5rem;
      color: #808080;
    }

    @media (max-width: 768px) {
      margin: 0.5rem 0;
    }

    @media (max-width: 425px) {
      font-size: 12px;
    }
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

  .information-driver {
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

  .chat-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .trip-status {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .status-title {
    font-size: 20px;
  }

  .diviser {
    width: 90%;
    border: 1px solid #d8d8d8;
    margin-left: 5%;
    margin-top: 5px;
    margin-bottom: 20px;
  }

  .price-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .price-title {
    margin-bottom: 7px;
    font-size: 16px;
  }

  .price {
    font-size: 25px;
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
  }
`;
