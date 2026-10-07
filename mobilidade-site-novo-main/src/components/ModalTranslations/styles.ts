import styled from "styled-components";

export const Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 750px;
    background-color: #f1f1f1f1;
    border: '2px solid #000';
    padding: 2rem 4rem;
    border-radius: 8px;

    .content-translations{
        > h1{
            text-align: center;
            font-size: 35px;
            margin-bottom: 2.5rem;
        }
    }

    .content-translations .content-button-close-modal{
        button{
            position: absolute;
            right: 0;
            top: 0;
            margin: 1rem;
            cursor: pointer;
            background: none;
            border: none;
        }
    }

    .content-translations .content-cards-translation{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    @media(max-width: 768px){
        width: 95%;

        .content-translations .content-cards-translation{
            flex-wrap: wrap;
        }
    }
`