import styled from "styled-components";

export const Container = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .content-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1360px;
    margin: 0 auto;
    padding: 0.85rem 3rem;
    box-sizing: border-box;
  }

  .content-nav .content-logo {
    a {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.85;
      }
    }
    
    img {
      height: 42px;
      width: auto;
      max-width: 120px;
      object-fit: contain;
      display: block;
    }
    
    .project-name {
      font-size: 1.4rem;
      font-weight: 700;
      color: #0f172a;
      text-transform: capitalize;
      white-space: nowrap;
      letter-spacing: -0.3px;
    }
  }

  .content-nav .content-links {
    display: flex;
    gap: 30px;
    align-items: center;
    list-style: none;

    li {
      font-size: 15px;
      font-weight: 600;
    }

    li a {
      text-decoration: none;
      color: #334155;
      transition: color 0.2s ease;

      &:hover {
        color: var(--color-primary);
      }
    }

    .content-button-links {
      button {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        padding: 0.65rem 1.4rem;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        color: #ffffff;
        background: linear-gradient(
          135deg,
          var(--color-primary) 0%,
          var(--color-secondary) 100%
        );
        box-shadow: 0 4px 12px rgba(31, 85, 121, 0.25);
        transition: all 0.25s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(31, 85, 121, 0.35);
          filter: brightness(1.06);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    .content-button-translations {
      button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        color: #334155;
        transition: all 0.2s ease;

        &:hover {
          background-color: #f1f5f9;
          color: var(--color-primary);
        }
      }
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
    right: 0;
    background-color: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    padding: 2rem;
    z-index: 200;

    nav {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      flex-direction: column;

      > button {
        margin-bottom: 3rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
        color: #ffffff;
        transition: background 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;

        li {
          font-size: 18px;
          color: #ffffff;
          text-align: end;

          a {
            text-decoration: none;
            color: #ffffff;
            font-weight: 500;
            transition: color 0.2s;

            &:hover {
              color: var(--color-secondary);
            }
          }

          button {
            font-size: 16px;
            font-weight: 700;
            border: none;
            background: none;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }
  }

  @media (max-width: 986px) {
    .content-nav {
      padding: 0.85rem 2rem;
    }

    .content-nav .content-links {
      gap: 20px;

      li {
        font-size: 14px;
      }
    }

    .content-nav .content-logo {
      img {
        height: 36px;
      }
      
      .project-name {
        font-size: 1.2rem;
      }
    }
  }

  @media (max-width: 820px) {
    .content-nav .content-button-nav-mobile {
      display: block;

      button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0f172a;
      }
    }

    .content-nav .content-links {
      display: none;
    }
  }
`;
