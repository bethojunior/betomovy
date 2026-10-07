import styled from 'styled-components';

export const Container = styled.div`
  /* Mobile First - Base styles */
  * {
    box-sizing: border-box;
  }

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;

  /* Navbar - Mobile First */
  .nav-audit {
    flex-shrink: 0;
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
  }

  .nav-audit nav.nav-bar-option {
    background: #ff9a00;
    height: 60px;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .nav-audit nav.nav-bar-option .container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0 16px;
  }

  .nav-audit nav.nav-bar-option .brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .nav-audit nav.nav-bar-option .brand-icon a {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .nav-audit nav.nav-bar-option .brand-icon img {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 4px;
  }

  .nav-audit nav.nav-bar-option .project-name-nav {
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
  }

  /* Loading State - Mobile First */
  .audit-loading {
    text-align: center;
    padding: 80px 20px 40px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .audit-loading p {
    font-size: 1rem;
    color: #666;
    margin-top: 20px;
  }

  /* Error State - Mobile First */
  .audit-error {
    padding: 80px 20px 40px;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .audit-error .container-home {
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .audit-error .describ-text {
    margin: 20px 0;
    text-align: center;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.6;
  }

  .btn-center {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .btn-saiba-mais {
    background: linear-gradient(135deg, #ff9a00 0%, #ff7700 100%);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 4px 12px rgba(255, 154, 0, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 154, 0, 0.4);
    }
  }

  /* Content Area - Mobile First */
  #audit-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 60px;
  }

  /* Hero Image - Totalmente Responsiva */
  #audit-content .audit-hero-image {
    position: relative;
    width: 100%;
    overflow: hidden;
    flex-shrink: 0;
  }

  #audit-content .audit-hero-image img {
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
    display: block;
    max-width: 100%;
  }

  #audit-content .audit-hero-image .desktop-img {
    display: none;
  }

  #audit-content .audit-hero-image .mobile-img {
    display: block;
  }

  /* Container principal - Mobile First */
  #audit-content .container-home {
    padding: 24px 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  #audit-content .container-home .audit-text-wrapper {
    width: 100%;
    max-width: 100%;
  }

  #audit-content .container-home .audit-title {
    font-size: 1.4rem;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    margin: 0 0 20px 0;
    color: #333;
    letter-spacing: 0.5px;
    line-height: 1.3;
  }

  #audit-content .container-home .describ-text {
    margin: 0;
    text-align: left;
    width: 100%;
    font-weight: 400;
    line-height: 1.6;
    font-size: 0.95rem;
    color: #555;
  }

  /* Seção Promocional - Mobile First */
  .audit-promotion-section {
    background: linear-gradient(135deg, #ff9a00 0%, #ff7700 100%) !important;
    padding: 40px 20px;
    width: 100%;
  }

  .audit-promotion-section .container-home {
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .promotion-content {
    text-align: center;
    color: white;
  }

  .promotion-content h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 20px 0;
    line-height: 1.3;
  }

  .promotion-content p {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.6;
    margin: 0 0 30px 0;
  }

  .promotion-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .btn-promotion {
    background: white;
    color: #ff9a00;
    border: none;
    padding: 14px 28px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    min-width: 200px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
  }



  /* Footer - Mobile First */
  footer.footer {
    flex-shrink: 0;
    width: 100%;
    padding: 24px 20px;
    background-color: #ff9a00;
    margin-top: auto;
  }

  footer.footer .footer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }

  footer.footer .collun-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
  }

  footer.footer .collun-container img {
    width: 50px;
    height: auto;
    border-radius: 4px;
  }

  footer.footer .copy {
    text-align: center;
    width: 100%;
  }

  footer.footer .copy p {
    margin: 0;
    font-size: 0.8rem;
    color: #fff;
    line-height: 1.4;
  }

  .footer .project-name-footer {
    text-transform: capitalize;
    font-weight: 600;
  }

  /* Tablet - 768px and up */
  @media (min-width: 768px) {
    .nav-audit nav.nav-bar-option {
      height: 70px;
    }

    .nav-audit nav.nav-bar-option .brand-icon img {
      width: 50px;
      height: 50px;
    }

    .nav-audit nav.nav-bar-option .project-name-nav {
      font-size: 1.3rem;
    }

    #audit-content {
      padding-top: 70px;
    }

    #audit-content .audit-hero-image {
      min-height: 300px;
    }

    #audit-content .container-home {
      padding: 40px 32px;
      max-width: 800px;
      margin: 0 auto;
    }

    #audit-content .container-home .audit-title {
      font-size: 1.8rem;
      margin-bottom: 24px;
    }

    #audit-content .container-home .describ-text {
      font-size: 1rem;
      text-align: justify;
      text-indent: 1.5rem;
    }



    footer.footer {
      padding: 32px;
    }

    footer.footer .collun-container img {
      width: 60px;
    }

    footer.footer .copy p {
      font-size: 0.9rem;
    }

    .audit-loading {
      padding: 100px 40px 60px;
    }

    .audit-loading p {
      font-size: 1.1rem;
    }

    .audit-error {
      padding: 100px 40px 60px;
    }

    .audit-promotion-section {
      padding: 50px 32px;
    }

    .promotion-content h1 {
      font-size: 1.8rem;
    }

    .promotion-content p {
      font-size: 1.1rem;
    }

    .promotion-buttons {
      flex-direction: row;
      justify-content: center;
      gap: 20px;
    }

    .btn-promotion {
      font-size: 16px;
      min-width: 220px;
    }
  }

  /* Desktop - 1024px and up */
  @media (min-width: 1024px) {
    .nav-audit nav.nav-bar-option .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }

    .nav-audit nav.nav-bar-option .brand-icon a {
      gap: 15px;
    }

    .nav-audit nav.nav-bar-option .project-name-nav {
      font-size: 1.5rem;
    }

    #audit-content .audit-hero-image {
      min-height: 400px;
    }

    #audit-content .audit-hero-image .desktop-img {
      display: block;
    }

    #audit-content .audit-hero-image .mobile-img {
      display: none;
    }

    #audit-content .container-home {
      padding: 60px 80px;
      max-width: 1200px;
    }

    #audit-content .container-home .audit-title {
      font-size: 2rem;
      margin-bottom: 32px;
      letter-spacing: 1px;
    }

    #audit-content .container-home .describ-text {
      font-size: 1.1rem;
      text-indent: 2rem;
      line-height: 1.8;
    }



    footer.footer {
      padding: 40px 60px;
    }

    footer.footer .collun-container img {
      width: 70px;
    }

    .audit-loading {
      padding: 120px 60px 80px;
    }

    .audit-loading p {
      font-size: 1.2rem;
    }

    .audit-error {
      padding: 120px 60px 80px;
    }

    .audit-error .container-home {
      padding: 40px 60px;
      max-width: 800px;
      margin: 0 auto;
    }

    .audit-promotion-section {
      padding: 60px 0;
    }

    .audit-promotion-section .container-home {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 80px;
    }

    .promotion-content h1 {
      font-size: 2.2rem;
      margin-bottom: 24px;
    }

    .promotion-content p {
      font-size: 1.2rem;
      margin-bottom: 40px;
    }

    .btn-promotion {
      font-size: 18px;
      padding: 16px 32px;
      min-width: 250px;
    }
  }
`;