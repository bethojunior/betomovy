import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-y: auto;
  position: relative;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(7, 10, 26, 0.40) 0%, rgba(7, 10, 26, 0.80) 100%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 900px) {
    padding: 1.5rem 1rem;
  }
`;

export const Content = styled.div`
  max-width: 440px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
`;

export const ContentText = styled.div`
  display: none;
`;


/* ── Container do Formulário com FUNDO BRANCO PURO conforme exigido ── */
export const LoginCardContainer = styled.div`
  width: 100%;
  max-width: 440px;
  background-color: #FFFFFF !important;
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1);
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 30px 22px;
    border-radius: 16px;
  }
`;

export const HeaderCard = styled.div`
  text-align: center;
  margin-bottom: 28px;

  .card-logo-container {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;

    img {
      height: 58px;
      width: auto;
      max-width: 220px;
      object-fit: contain;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
    }
  }

  h2 {
    font-size: 24px;
    font-weight: 800;
    color: #070A1A;
    margin: 0 0 6px 0;
    letter-spacing: -0.3px;
  }

  p {
    font-size: 13.5px;
    color: #64748B;
    margin: 0;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12.5px;
    font-weight: 700;
    color: #1E293B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    background-color: #F8FAFC;
    border: 1.5px solid #E2E8F0;
    border-radius: 10px;
    font-size: 14px;
    color: #0F172A;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &::placeholder {
      color: #94A3B8;
    }

    &:focus {
      background-color: #FFFFFF;
      border-color: #00349A;
      box-shadow: 0 0 0 3px rgba(0, 52, 154, 0.15);
    }
  }
`;

export const CaptchaContainer = styled.div`
  background: #F1F5F9;
  border: 1.5px solid #CBD5E1;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &.has-error {
    border-color: #EF4444;
    background: #FEF2F2;
  }

  label {
    font-size: 13px;
    color: #334155;
    font-weight: 500;

    strong {
      color: #00349A;
      font-size: 15px;
      font-weight: 800;
    }
  }

  .captcha-actions {
    display: flex;
    gap: 10px;

    input {
      flex: 1;
      height: 40px;
      padding: 0 12px;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      text-align: center;
      outline: none;

      &:focus {
        border-color: #00349A;
      }
    }

    button {
      height: 40px;
      padding: 0 18px;
      background: #070A1A;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #111111 !important;
        color: #04F3FA;
      }
    }
  }

  .error-msg {
    font-size: 11px;
    color: #DC2626;
    font-weight: 600;
  }
`;

export const ButtonLogin = styled.button`
  width: 100%;
  height: 50px;
  background-color: #00349A;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.8px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 52, 154, 0.35);
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  /* REGRA: Hover DEVE SER PRETO (#111111) */
  &:hover:not(:disabled) {
    background-color: #111111 !important;
    color: #04F3FA !important;
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5) !important;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #64748B;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px;
  transition: color 0.15s ease;
  text-align: center;

  &:hover {
    color: #00349A;
    text-decoration: underline;
  }
`;

export const ImportantFooter = styled.div`
  border-top: 1px solid #F1F5F9;
  padding-top: 16px;
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .security-notice {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748B;
    font-size: 11.5px;
    font-weight: 600;

    svg {
      color: #00349A;
    }
  }

  .coords {
    font-size: 10.5px;
    color: #94A3B8;
    font-family: monospace;
  }
`;
