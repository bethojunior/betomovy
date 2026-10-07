import styled from "styled-components";

// Cada página já tem uma regra global "form select { width: 100% }" com
// especificidade maior que uma classe simples de styled-component — daí o
// !important, senão esse mini-select herda o tamanho do form inteiro.
export const Select = styled.select`
    flex: 0 0 auto !important;
    width: auto !important;
    min-width: 92px !important;
    height: 50px !important;
    padding: 0 0.5rem !important;
    margin: 1rem 0 !important;
    border: 1px solid var(--color-black) !important;
    border-radius: 0 !important;
    font-size: 15px !important;
    font-weight: 400 !important;
    color: var(--color-black) !important;
    background-color: var(--color-white) !important;
    background-image: none !important;
    box-sizing: border-box !important;
    cursor: pointer;
    text-align: center !important;
    text-align-last: center !important;

    /* breakpoint mobile já usado nas páginas de cadastro (Passenger/PersonalData) */
    @media (max-width: 500px) {
        min-width: 76px !important;
        font-size: 14px !important;
        padding: 0 0.3rem !important;
    }
`;
