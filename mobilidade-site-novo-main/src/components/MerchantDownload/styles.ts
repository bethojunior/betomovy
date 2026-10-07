import styled from "styled-components";

export const Container = styled.section`
    .content-merchant-website{
        width: 100%;
        padding: 2rem;
        background: var(--color-primary);
        background: linear-gradient(0deg, var(--color-primary) 0%, var(--color-secondary) 100%);

        > h1 {
            font-size: 50px;
            text-align: center;
            color: var(--color-white);
        }
    }

    .content-merchant-website .content-buttons{
        display: flex;
        justify-content: center;
        margin: 1rem 0;
        gap: 25px;

        a{
            text-align: center;
            border-radius: 8px;
            border: none;
            cursor: pointer;
        }
    }

    @media(max-width: 986px){
        .content-merchant-website{
            > h1 {
                font-size: 30px;
            }
        }

        .content-merchant-website .content-buttons{
            button{
                img{
                    width: 100%;
                    height: 50px;
                }
            }
        }
    }

    @media(max-width: 768px){
        .content-merchant-website{
            > h1 {
                font-size: 25px;
            }
        }
    }

    @media(max-width: 500px){
        .content-merchant-website .content-buttons{
            flex-direction: column;
        }
    }
`