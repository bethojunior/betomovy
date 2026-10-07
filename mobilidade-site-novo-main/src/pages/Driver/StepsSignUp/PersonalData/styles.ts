import styled from "styled-components";

export const Container = styled.div`
    h1{
        font-size: 30px;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .content-personal-data{
        input{
            width: 100%;
            display: block;
            outline: none;
            padding: 0.8rem 1rem;
            font-size: 20px;
            margin: 1rem 0;
            border: 1px solid var(--color-black);
            border-radius: 0;
            height: 50px;
            box-sizing: border-box;
            color: var(--color-black);
        }

        /* Padroniza placeholders dos inputs */
        input::placeholder{
            color: var(--color-placeholder);
            font-size: 20px;
            font-weight: 400;
            opacity: 1;
        }

        select{
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

        /* Placeholder do select nativo (primeira option desabilitada) sem negrito */
        select option[disabled] {
            font-weight: 400;
            color: var(--color-placeholder);
            font-size: 20px;
        }

        /* Classes para estilização condicional dos selects */
        select.select-placeholder {
            color: var(--color-placeholder);
            font-weight: 400;
        }

        select.select-value {
            color: var(--color-black);
            font-weight: 400;
        }

        /* Foco padrão (sem glow) */
        input:focus,
        select:focus{
            border-color: var(--color-black);
            box-shadow: none;
        }
    }

    .content-personal-data .content-two-columns{
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;

        div{
            width: 100%;
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

    .phone-input-row .container-input {
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

    .content-personal-data .errors-input{
        color: red;
        font-size: 16px;
    }

    .content-personal-data .content-button{
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 1rem 0;
        
        button:nth-child(1){
            background: none;
            border: 2px solid var(--color-primary);
            color: var(--color-primary);
        }

        button{
            width: 100%;
            font-size: 20px;
            font-weight: bold;
            padding: 0.5rem 1.5rem;
            border: none;
            border-radius: 360px;
            cursor: pointer;
            color: var(--color-white);
            background-color: var(--color-primary);
            transform: scale(0.9);

            &:hover{
                transform: scale(1);
                transition: all ease 0.4s;
            }
        }

        
        .main-button:disabled {
            background-color: #cccccc !important; /* cinza claro */
            color: #888888 !important;            /* texto cinza */
            cursor: not-allowed !important;
            opacity: 1 !important; /* Mantém o botão visível, só muda a cor */
        }
    }

    @media(max-width: 768px){
        .content-personal-data{
            input,
            input::placeholder,
            select,
            select option[disabled] {
                font-size: 16px;
            }
        }
    }

    @media(max-width: 500px){
        .content-personal-data{
            input,
            input::placeholder,
            select,
            select option[disabled] {
                font-size: 14px;
            }
        }
    }
`