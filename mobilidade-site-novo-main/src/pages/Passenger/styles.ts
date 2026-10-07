import styled from "styled-components";

export const Container = styled.div`
    .content-passenger{
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 2rem;
    }

    .content-passenger .column-1{
        img{
            width: 250px;
            border-radius: 8px;
        }
        h1{ 
            font-size: 60px;
            color: var(--color-white);
            margin: 2rem 0;
        }
        span{
            width: 70%;
            display: block; 
            font-size: 25px;
            color: var(--color-white);
        }
    }

    .content-passenger .column-2{
        background-color: var(--color-white);
        padding: 1.5rem;
        border-radius: 10px;

        form > h1{
            font-size: 28px;
            text-align: center;
            margin: 1rem 0;
        }

        form input{
            width: 100%;
            display: block;
            outline: none;
            padding: 0.8rem 1rem;
            font-size: 20px;
            border: 1px solid var(--color-black);
            border-radius: 0;
            margin: 1rem 0;
            height: 50px;
            box-sizing: border-box;
            color: var(--color-black);
        }

        /* Padroniza placeholders dos inputs */
        form input::placeholder{
            color: var(--color-placeholder);
            font-size: 20px;
            font-weight: 400;
            opacity: 1;
        }

        form select{
            width: 100%;
            display: block;
            outline: none;
            padding: 0.8rem 1rem;
            font-size: 20px;
            font-weight: 400;
            color: var(--color-black);
            border: 1px solid var(--color-black);
            border-radius: 0;
            margin: 1rem 0;
            cursor: pointer;
            appearance: none;
            background-image: var(--arrow-svg);
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1rem;
            padding-right: 3rem;
            height: 50px;
            box-sizing: border-box;
        }

        /* Foco padrão (sem glow) */
        form input:focus,
        form select:focus{
            border-color: var(--color-black);
            box-shadow: none;
        }

        /* Placeholder do select nativo (primeira option desabilitada) sem negrito */
        form select option[disabled] {
            font-weight: 400;
            color: var(--color-placeholder);
            font-size: 20px;
        }

        /* Classes para estilização condicional dos selects */
        form select.select-placeholder {
            color: var(--color-placeholder);
            font-weight: 400;
        }

        form select.select-value {
            color: var(--color-black);
            font-weight: 400;
        }
    }

        .container-input {
        width: 100%;
        position: relative;
    }

    .phone-input-row {
        display: flex;
        align-items: flex-start;
        width: 100%;
        gap: 0.5rem;
    }

    .phone-input-row .container-input,
    .phone-input-row > input {
        flex: 1 1 0;
        min-width: 0;
    }

    .cpf-container {
        width: 100%;
        margin-bottom: 1rem;
    }

    .cpf-container input {
        padding-right: 2rem;
        width: 100%;
    }

    .cpf-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
    }

    .errors-input {
        color: red;
        font-size: 14px;
        display: block;
        margin-top: -10px;
        min-height: 18px;
    }

    .content-passenger .column-2 .content-two-columns{
        display: flex;
        gap: 20px;
    }

    .content-passenger .column-2 .content-button-submit{
        text-align: center;
    }

    .content-passenger .column-2 .erros-input{
        font-size: 18px;
        color: red;
    }

    @media(max-width: 1024px){
        .content-passenger{
            flex-direction: column;
            align-items: center;
        }

        .content-passenger .column-1{
            text-align: center;

            h1{ 
                text-align: center;
                color: var(--color-white);
                margin: 2rem 0;
            }
            span{
                width: 100%;
                text-align: center;
                margin-bottom: 1rem;
            }
        }
    }

    @media(max-width: 768px){
        .content-passenger .column-1{
            img{
                width: 150px;
            }

            text-align: center;

            h1{ 
                font-size: 45px;
            }
            span{
                font-size: 18px;
            }
        }

        .content-passenger .column-2{
            background-color: var(--color-white);
            padding: 1.5rem;
            border-radius: 10px;

            form > h1{
                font-size: 35px;
            }

            form input,
            form input::placeholder,
            form select,
            form select option[disabled] {
                font-size: 16px;
            }
        }
    }

    @media(max-width: 500px){
        .content-passenger{
            padding: 2rem 1rem;
        }

        .content-passenger .column-1{
            h1{ 
                font-size: 35px;
            }
        }

        .content-passenger .column-2{
            background-color: var(--color-white);
            padding: 1.5rem;
            border-radius: 10px;

            form > h1{
                font-size: 30px;
            }

            form input,
            form input::placeholder,
            form select,
            form select option[disabled] {
                font-size: 14px;
            }
        }

        .content-passenger .column-2 .erros-input{
            font-size: 14px;
            color: red;
        }
    }
`

export const ContainerButton = styled.div`
    button {
        font-size: 24px;
        font-weight: bold;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 360px;
        cursor: pointer;
        color: var(--color-white);
        background-color: var(--color-primary);
        transition: all ease 0.3s;

        &:not(:disabled):hover {
            background: linear-gradient(
                0deg,
                var(--color-primary) 0%,
                var(--color-secondary) 100%
            );
        }

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }

    @media (max-width: 986px) {
        button {
            font-size: 18px;
        }
    }
`;
