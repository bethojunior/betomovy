import styled from "styled-components";

export const Container = styled.div`
    h1{
        font-size: 30px;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .content-data-select-city{
        /* Estilos removidos - SelectCity usa react-select, não select nativo */
    }

    .content-data-select-city .errors-input{
        color: red;
        font-size: 16px;
    }

    .content-data-select-city .content-button{
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 1rem 0;
        
        button:nth-child(1){
            background: none;
            border: 2px solid var(--color-primary);
            color: var(--color-button-primary);
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
    }
`