import styled from "styled-components";

export const Container = styled.div`
    .content-banner {
        width: 100%;
        min-height: calc(100vh - 80px);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
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
                180deg,
                rgba(15, 23, 42, 0.55) 0%,
                rgba(15, 23, 42, 0.35) 50%,
                rgba(15, 23, 42, 0.6) 100%
            );
            pointer-events: none;
            z-index: 1;
        }
    }

    .content-banner .content {
        position: relative;
        z-index: 2;
        max-width: 960px;
        margin: 0 auto;
        padding: 4rem 2rem;
        text-align: center;
        box-sizing: border-box;

        h1 {
            font-size: clamp(2.4rem, 4.5vw, 4rem);
            font-weight: 800;
            color: #ffffff;
            line-height: 1.15;
            letter-spacing: -1px;
            margin: 0 auto 1.5rem auto;
            text-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
            max-width: 900px;
        }

        p {
            font-size: clamp(1.1rem, 1.8vw, 1.35rem);
            font-weight: 400;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.95);
            margin: 0 auto 2.5rem auto;
            max-width: 780px;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }
    }

    .content-banner .content .content-buttons {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
        margin-top: 1rem;
    }

    .content-description-website {
        width: 100%;
        max-width: 1200px;
        margin: 5rem auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 3rem;
        box-sizing: border-box;
    }

    .content-description-website .content-img {
        flex: 0.8;
        text-align: center;

        img {
            max-width: 220px;
            height: auto;
            object-fit: contain;
            display: inline-block;
        }
    }

    .content-description-website .description {
        flex: 1.2;

        p {
            margin: 1.25rem 0;
            font-size: clamp(1.15rem, 1.8vw, 1.45rem);
            line-height: 1.65;
            color: #334155;
            font-weight: 400;
        }
    }

    .content-doubts {
        width: 100%;
        padding: 5rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #0f172a;
        box-sizing: border-box;
        gap: 4rem;
    }

    .content-doubts .content-column-1 {
        color: #ffffff;
        max-width: 480px;

        h1 {
            font-size: clamp(2rem, 3.5vw, 3rem);
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.5px;
            color: #ffffff;
        }

        span {
            font-size: 1.1rem;
            color: #94a3b8;
            display: block;
            margin-top: 1rem;
            line-height: 1.5;
        }
    }

    .content-doubts .content-column-2 {
        max-width: 500px;
        width: 100%;

        form {
            button {
                width: 100%;
                height: 48px;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
                border: none;
                color: #ffffff;
                cursor: pointer;
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

            span {
                display: block;
                margin-top: 4px;
                color: #ef4444;
                font-size: 12px;
                font-weight: 500;
            }
        }
    }

    .content-doubts .content-column-2 form .content-inputs {
        display: flex;
        gap: 16px;
        margin-bottom: 1rem;

        > div {
            flex: 1;
        }

        input {
            width: 100%;
            height: 48px;
            padding: 0 1rem;
            font-size: 15px;
            outline: none;
            border: 1.5px solid #334155;
            background-color: #1e293b;
            color: #ffffff;
            border-radius: 10px;
            box-sizing: border-box;
            transition: all 0.2s ease;

            &::placeholder {
                color: #64748b;
            }

            &:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px rgba(31, 85, 121, 0.25);
            }
        }
    }

    .content-doubts .content-column-2 form .content-textarea {
        margin-bottom: 1.25rem;

        textarea {
            width: 100%;
            height: 130px;
            border-radius: 10px;
            padding: 0.85rem 1rem;
            outline: none;
            font-size: 15px;
            border: 1.5px solid #334155;
            background-color: #1e293b;
            color: #ffffff;
            box-sizing: border-box;
            resize: vertical;
            transition: all 0.2s ease;

            &::placeholder {
                color: #64748b;
            }

            &:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px rgba(31, 85, 121, 0.25);
            }
        }
    }

    @media (max-width: 986px) {
        .content-banner .content {
            padding: 3rem 1.5rem;
        }

        .content-description-website {
            flex-direction: column;
            margin: 3.5rem auto;
            text-align: center;
        }

        .content-description-website .description p {
            text-align: center;
        }

        .content-doubts {
            flex-direction: column;
            gap: 3rem;
            padding: 3.5rem 1.5rem;
        }

        .content-doubts .content-column-1 {
            text-align: center;
            max-width: 100%;
        }
    }

    @media (max-width: 600px) {
        .content-banner .content {
            padding: 2.5rem 1rem;

            h1 {
                font-size: 2.2rem;
            }

            p {
                font-size: 1.05rem;
            }
        }

        .content-banner .content .content-buttons {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
        }

        .content-doubts .content-column-2 form .content-inputs {
            flex-direction: column;
            gap: 12px;
        }
    }
`;