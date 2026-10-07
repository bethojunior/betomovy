import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-white, #fff);

  .content-box {
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .content-box img {
    max-width: 200px;
    height: auto;
  }

  .content-box h4 {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    margin: 0;
    line-height: 1.4;
  }

  .content-box h4.title-exemption .title-exemption-line {
    display: block;
  }

  .content-box h2 {
    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
    margin: 0;
  }

  .content-box .field-code {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .content-box .field-code label {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .content-box .field-code input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .content-box .field-code input:focus {
    outline: none;
    border-color: var(--color-primary, #ff9a00);
  }

  .content-box button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background-color: var(--color-primary, #ff9a00);
    color: var(--color-white, #fff);
    cursor: pointer;
    width: 100%;
    max-width: 280px;
  }

  .content-box button:hover:not(:disabled) {
    opacity: 0.9;
  }

  .content-box button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
