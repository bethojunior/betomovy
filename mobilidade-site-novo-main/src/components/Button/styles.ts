import styled from "styled-components";

export const Container = styled.div`
    button{
        font-size: 24px;
        font-weight: bold;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 360px;
        cursor: pointer;
        color: var(--color-white);
        background-color: var(--color-primary);

        &:hover{
            transition: all ease 0.3s;
            background: linear-gradient(0deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        }
    }

    @media(max-width: 986px){
        button{
            font-size: 18px;
        }
    }
`