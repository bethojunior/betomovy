import styled from "styled-components";

export const Container = styled.div`
    .content-passenger {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 3rem;
        padding: 4rem 3rem;
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
                90deg,
                rgba(15, 23, 42, 0.45) 0%,
                rgba(15, 23, 42, 0.15) 55%,
                rgba(15, 23, 42, 0.35) 100%
            );
            pointer-events: none;
            z-index: 1;
        }
    }

    .content-passenger .column-1 {
        position: relative;
        z-index: 2;
        flex: 1;
        max-width: 580px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .brand-header-link {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 8px 18px 8px 12px;
            border-radius: 9999px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
            margin-bottom: 2rem;
            transition: all 0.25s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
                background: #ffffff;
            }

            img {
                height: 38px;
                width: 38px;
                object-fit: contain;
                display: block;
            }

            .brand-name {
                font-size: 1.35rem;
                font-weight: 700;
                color: #0f172a;
                letter-spacing: -0.3px;
                text-transform: capitalize;
            }

            &.is-app {
                background: transparent !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                padding: 0 !important;
                display: flex !important;
                justify-content: center !important;
                margin: 0 auto 1.5rem auto !important;

                img {
                    width: 130px !important;
                    height: 130px !important;
                    border-radius: 16px !important;
                    object-fit: contain !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                }

                .brand-name {
                    display: none !important;
                }
            }
        }

        h1.passenger-title { 
            font-size: clamp(2.4rem, 4vw, 3.6rem);
            font-weight: 800;
            color: #ffffff;
            line-height: 1.15;
            letter-spacing: -1px;
            margin: 0 0 1.25rem 0;
            text-shadow: 0 3px 12px rgba(0, 0, 0, 0.55);
        }

        .passenger-description,
        span {
            font-size: clamp(1.1rem, 1.8vw, 1.35rem);
            font-weight: 400;
            line-height: 1.55;
            color: rgba(255, 255, 255, 0.95);
            max-width: 90%;
            display: block;
            margin: 0;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }
    }

    .content-passenger .column-2 {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 470px;
        background: #ffffff;
        padding: 2.25rem 2rem;
        border-radius: 18px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;

        form > h1 {
            font-size: 26px;
            font-weight: 700;
            color: #0f172a;
            text-align: center;
            margin: 0 0 1.5rem 0;
            letter-spacing: -0.4px;
        }

        /* Espaçamento consistente entre os campos */
        form > div {
            margin-bottom: 0.9rem;
        }

        form input {
            width: 100%;
            height: 48px;
            display: block;
            outline: none;
            padding: 0 1rem;
            font-size: 15px;
            font-weight: 400;
            color: #1e293b;
            background-color: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            box-sizing: border-box;
            transition: all 0.2s ease;

            &::placeholder {
                color: #94a3b8;
                font-size: 15px;
                font-weight: 400;
                opacity: 1;
            }

            &:focus {
                border-color: var(--color-primary);
                background-color: #ffffff;
                box-shadow: 0 0 0 3px rgba(31, 85, 121, 0.15);
            }
        }

        form select {
            width: 100%;
            height: 48px;
            display: block;
            outline: none;
            padding: 0 2.5rem 0 1rem;
            font-size: 15px;
            font-weight: 400;
            color: #1e293b;
            background-color: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            cursor: pointer;
            appearance: none;
            background-image: var(--arrow-svg);
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 0.85rem;
            box-sizing: border-box;
            transition: all 0.2s ease;

            &:focus {
                border-color: var(--color-primary);
                background-color: #ffffff;
                box-shadow: 0 0 0 3px rgba(31, 85, 121, 0.15);
            }

            option[disabled] {
                font-weight: 400;
                color: #94a3b8;
                font-size: 15px;
            }

            &.select-placeholder {
                color: #94a3b8;
                font-weight: 400;
            }

            &.select-value {
                color: #1e293b;
                font-weight: 400;
            }
        }
    }

    .container-input {
        width: 100%;
        position: relative;
    }

    .phone-input-row {
        display: flex;
        align-items: stretch;
        width: 100%;
        gap: 0.6rem;

        .container-input,
        > input {
            flex: 1 1 0;
            min-width: 0;
            margin: 0;
        }
    }

    .cpf-container {
        width: 100%;
        margin-bottom: 0.9rem;
    }

    .cpf-container input {
        padding-right: 2.5rem;
        margin: 0;
    }

    .cpf-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    }

    .errors-input {
        color: #ef4444;
        font-size: 12px;
        font-weight: 500;
        display: block;
        margin-top: 4px;
        min-height: 16px;
    }

    .content-passenger .column-2 .content-two-columns {
        display: flex;
        gap: 16px;
    }

    .content-passenger .column-2 .content-button-submit {
        margin-top: 1.25rem;
        text-align: center;
    }

    .content-passenger .column-2 .erros-input {
        font-size: 12px;
        font-weight: 500;
        color: #ef4444;
        margin-top: 4px;
        display: block;
    }

    @media (max-width: 1024px) {
        .content-passenger {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem 1.5rem;
            gap: 2.5rem;
        }

        .content-passenger .column-1 {
            max-width: 100%;
            align-items: center;
            text-align: center;

            .brand-header-link {
                margin-bottom: 1.5rem;
            }

            h1.passenger-title { 
                text-align: center;
                font-size: 2.75rem;
            }

            .passenger-description,
            span {
                width: 100%;
                text-align: center;
                margin-bottom: 1rem;
            }
        }

        .content-passenger .column-2 {
            max-width: 480px;
        }
    }

    @media (max-width: 600px) {
        .content-passenger {
            padding: 2.5rem 1rem;
        }

        .content-passenger .column-1 {
            h1.passenger-title { 
                font-size: 2.2rem;
            }

            .passenger-description,
            span {
                font-size: 1.05rem;
            }
        }

        .content-passenger .column-2 {
            padding: 1.5rem 1.25rem;
            border-radius: 16px;

            form > h1 {
                font-size: 22px;
                margin-bottom: 1.25rem;
            }

            form input,
            form input::placeholder,
            form select,
            form select option[disabled] {
                font-size: 14px;
                height: 46px;
            }
        }
    }
`;

export const ContainerButton = styled.div`
    width: 100%;

    button {
        width: 100%;
        height: 50px;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        padding: 0 1.5rem;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        color: #ffffff;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        box-shadow: 0 4px 14px rgba(31, 85, 121, 0.35);
        transition: all 0.25s ease;

        &:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(31, 85, 121, 0.45);
            filter: brightness(1.06);
        }

        &:not(:disabled):active {
            transform: translateY(0);
        }

        &:disabled {
            background: #cbd5e1;
            box-shadow: none;
            cursor: not-allowed;
        }
    }

    @media (max-width: 600px) {
        button {
            height: 46px;
            font-size: 14px;
        }
    }
`;
