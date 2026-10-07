import styled from "styled-components";

export const Container = styled.div`
    h1{
        font-size: 30px;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .content-data-vehicles .content-inputs input{
            width: 100%;
            display: block;
            outline: none;
            padding: 0.8rem 1rem;
            font-size: 20px;
            margin: 1rem 0;
    }

    .content-data-vehicles{
        select{
            width: 100%;
            display: block;
            outline: none;
            padding: 0.8rem 1rem;
            font-size: 20px;
            margin: 1rem 0;
            cursor: pointer;
        }
    }

    .content-data-vehicles .content-inputs .link-button{
        display: block;
        width: auto;
        background: none;
        border: none;
        padding: 0;
        margin: -0.5rem 0 1rem;
        font-size: 16px;
        text-decoration: underline;
        color: var(--color-primary);
        cursor: pointer;
    }

    .content-data-vehicles .brand-option{
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .content-data-vehicles .brand-option-icon{
        width: 18px;
        height: 18px;
        object-fit: contain;
        flex-shrink: 0;
    }

    .content-data-vehicles .brand-option-fallback{
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #e8e8e8;
        color: var(--color-primary);
        font-size: 10px;
        font-weight: bold;
    }

    .content-data-vehicles .content-isallocated{
        display: flex;
        align-items: center;
        gap: 20px;
        margin: 1rem 0;
    }

    .content-data-vehicles .errors-input{
        color: red;
        font-size: 16px;
    }

    .content-data-vehicles .content-button{
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

    }
`