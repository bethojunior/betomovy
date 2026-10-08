import styled from "styled-components";

export const Container = styled.section`
    .content-merchant-website{
        width: 100%;
        padding: 3.5rem 2rem;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        box-sizing: border-box;

        > h1 {
            font-size: clamp(1.8rem, 3.2vw, 2.75rem);
            font-weight: 800;
            text-align: center;
            color: var(--color-white);
            letter-spacing: -0.5px;
            line-height: 1.25;
            margin-bottom: 2rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
    }

    .content-merchant-website .content-buttons{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        gap: 20px;

        a{
            text-align: center;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            display: inline-block;
            transition: all 0.25s ease;

            &:hover {
                transform: translateY(-3px);
                filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
            }

            &:active {
                transform: translateY(0);
            }

            img {
                height: 52px;
                width: auto;
                display: block;
                border-radius: 10px;
            }
        }
    }

    @media(max-width: 768px){
        .content-merchant-website{
            padding: 2.5rem 1.5rem;

            > h1 {
                margin-bottom: 1.5rem;
            }
        }

        .content-merchant-website .content-buttons{
            gap: 16px;
            a img {
                height: 48px;
            }
        }
    }

    @media(max-width: 500px){
        .content-merchant-website .content-buttons{
            flex-direction: column;
            align-items: center;
            gap: 14px;
        }
    }
`;