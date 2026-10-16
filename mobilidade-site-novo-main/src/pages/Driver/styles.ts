import styled from "styled-components";

export const Container = styled.div`
  .content-driver {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    min-height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 3rem;
    padding: 4rem 3rem;
    box-sizing: border-box;

    /* Suave degradê para assegurar legibilidade dos textos sem obscurecer a imagem de fundo */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        rgba(15, 23, 42, 0.45) 0%,
        rgba(15, 23, 42, 0.15) 55%,
        rgba(15, 23, 42, 0.35) 100%
      );
      pointer-events: none;
      z-index: 1;
    }
  }

  .content-driver .column-1 {
    position: relative;
    z-index: 2;
    flex: 1;
    max-width: 580px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .brand-header-link {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 8px 18px 8px 12px;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
      margin-bottom: 2rem;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
        background: #ffffff;
      }

      img {
        height: 38px;
        width: 38px;
        object-fit: contain;
        display: block;
      }

      .brand-name {
        font-size: 1.35rem;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.3px;
        text-transform: capitalize;
      }

      &.is-app {
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        display: flex !important;
        justify-content: center !important;
        margin: 0 auto 1.5rem auto !important;

        img {
          width: 130px !important;
          height: 130px !important;
          border-radius: 16px !important;
          object-fit: contain !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .brand-name {
          display: none !important;
        }
      }
    }

    h1.driver-title {
      font-size: clamp(2.4rem, 4vw, 3.6rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: -1px;
      margin: 0 0 1.25rem 0;
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.55);
    }

    span {
      font-size: clamp(1.1rem, 1.8vw, 1.35rem);
      font-weight: 400;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.95);
      max-width: 90%;
      display: block;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
  }

  .content-driver .column-2 {
    position: relative;
    z-index: 2;
    max-width: 580px;
    width: 100%;
    background-color: #ffffff;
    padding: 2.25rem 2rem;
    border-radius: 18px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    align-self: flex-start;
  }

  .content-driver .column-2 .form-terms {
    font-size: 0.8rem;
    margin: 0.75rem 0;
    color: #64748b;
    line-height: 1.5;
  }

  .content-driver .column-2 .content-category {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    max-height: 500px;
    overflow-y: auto;
    padding: 4px;
  }

  .content-driver .column-2 .content-category > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1.5px solid #cbd5e1;
    background: #f8fafc;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-primary);
      background: #ffffff;
      box-shadow: 0 4px 14px rgba(31, 85, 121, 0.12);
      transform: translateY(-2px);
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
    font-size: 17px;
    font-weight: 600;
    color: #0f172a;
  }

  .content-driver
    .column-2
    .content-category
    > div
    .content-description-category
    img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .content-driver .column-2 .content-category > div .content-icon-arrow img {
    width: 16px;
    opacity: 0.7;
  }

  /* SCREEN SUCCESS */
  .content-success-screen .content-icon-success {
    text-align: center;
    img {
      width: 130px;
      margin: 1.5rem 0;
    }
  }

  .content-success-screen .text-success {
    font-size: 26px;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    margin: 1rem 0;
  }

  .content-success-screen .text-description {
    font-size: 16px;
    color: #64748b;
    text-align: center;
    line-height: 1.6;
  }

  .content-success-screen .content-buttons {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin: 2rem 0;

    button:nth-child(1) {
      background: none;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
    }

    button {
      width: 100%;
      height: 48px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 0 1.5rem;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      color: #ffffff;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      box-shadow: 0 4px 14px rgba(31, 85, 121, 0.35);
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(31, 85, 121, 0.45);
        filter: brightness(1.06);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  @media (max-width: 1024px) {
    .content-driver {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      gap: 2.5rem;
    }

    .content-driver .column-1 {
      max-width: 100%;
      align-items: center;
      text-align: center;

      .brand-header-link {
        margin-bottom: 1.5rem;
      }

      h1.driver-title {
        text-align: center;
        font-size: 2.75rem;
      }

      span {
        width: 100%;
        text-align: center;
        margin-bottom: 1rem;
      }
    }

    .content-driver .column-2 {
      max-width: 580px;
      margin: 0;
    }
  }

  @media (max-width: 600px) {
    .content-driver {
      padding: 2.5rem 1rem;
    }

    .content-driver .column-1 {
      h1.driver-title {
        font-size: 2.2rem;
      }

      span {
        font-size: 1.05rem;
      }
    }

    .content-driver .column-2 {
      padding: 1.5rem 1.25rem;
      border-radius: 16px;
    }
  }
`;
