import styled from "styled-components";

export const Container = styled.div`
    button {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        padding: 0.9rem 2.2rem;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        color: #ffffff;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        box-shadow: 0 4px 16px rgba(31, 85, 121, 0.35);
        transition: all 0.25s ease;
        white-space: nowrap;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 22px rgba(31, 85, 121, 0.45);
            filter: brightness(1.06);
        }

        &:active {
            transform: translateY(0);
        }
    }

    @media (max-width: 986px) {
        button {
            font-size: 14px;
            padding: 0.8rem 1.8rem;
        }
    }

    @media (max-width: 500px) {
        width: 100%;
        button {
            width: 100%;
            font-size: 13px;
            padding: 0.8rem 1.5rem;
        }
    }
`;