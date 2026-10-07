import styled from "styled-components";

export const Container = styled.div`
  .content-policy {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px 60px 3rem;
    text-align: justify;
    line-height: 1.5;
    color: var(--color-black);
  }

  .content-policy .policy-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .content-policy .policy-date {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .content-policy h2,
  .content-policy .section-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 1.5rem 0 0.75rem;
  }

  .content-policy h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
  }

  .content-policy p {
    margin-bottom: 0.75rem;
  }

  .content-policy ul,
  .content-policy ol {
    margin: 0.5rem 0 0.75rem 1.5rem;
  }

  .content-policy li {
    margin-bottom: 0.35rem;
  }

  .content-policy a {
    color: #0563c1;
    text-decoration: underline;
  }

  .content-policy a:hover {
    opacity: 0.9;
  }

  .content-policy-body {
    outline: none;
  }

  .content-policy-body p,
  .content-policy-body li {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    .content-policy {
      padding: 15px 24px 2rem;
    }
  }

  @media (max-width: 500px) {
    .content-policy {
      padding: 15px 16px 2rem;
    }

    .content-policy .policy-title {
      font-size: 1.25rem;
    }
  }
`;
