import styled from "styled-components";

// Cada página já tem uma regra global "form select { width: 100% }" com
// especificidade maior que uma classe simples de styled-component — daí o
// !important, senão esse mini-select herda o tamanho do form inteiro.
export const Select = styled.select`
    flex: 0 0 auto !important;
    width: auto !important;
    min-width: 95px !important;
    height: 48px !important;
    padding: 0 0.6rem !important;
    margin: 0 !important;
    border: 1.5px solid #cbd5e1 !important;
    border-radius: 10px !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    color: #1e293b !important;
    background-color: #f8fafc !important;
    background-image: none !important;
    box-sizing: border-box !important;
    cursor: pointer;
    text-align: center !important;
    text-align-last: center !important;
    outline: none !important;
    transition: all 0.2s ease !important;

    &:focus {
        border-color: var(--color-primary) !important;
        background-color: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(31, 85, 121, 0.15) !important;
    }

    /* breakpoint mobile já usado nas páginas de cadastro (Passenger/PersonalData) */
    @media (max-width: 500px) {
        min-width: 80px !important;
        font-size: 14px !important;
        padding: 0 0.4rem !important;
    }
`;
