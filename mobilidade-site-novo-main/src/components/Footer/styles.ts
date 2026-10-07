import styled from "styled-components";

export const Container = styled.footer`
    background-color: var(--color-white);
    padding: 2rem 3rem;

    .content{
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .content .content-logo{
        a {
            display: flex;
            align-items: center;
            gap: 15px;
            text-decoration: none;
        }
        
        img{
            width: 100px;
        }
        
        .project-name {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-black);
            text-transform: capitalize;
            white-space: nowrap;
        }
    }

    .content .content-description{
        span{
            display: block;
            font-size: 20px;
            color: gray;
            text-align: center;
        }

        .footer-link-privacy {
            display: block;
            margin-top: 0.5rem;
            font-size: 1rem;
            color: var(--color-primary);
            text-decoration: none;
            text-align: center;
        }

        .footer-link-privacy:hover {
            text-decoration: underline;
        }
    }

    .content .content-midias-socials{
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .content .content-midias-socials .content-button-circle{
        margin-left: 1rem;
        cursor: pointer;
        background: linear-gradient(0deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        padding: 0.5rem 0.6rem;
        border-radius: 360px;
    }

    @media(max-width: 768px){
        .content{
            flex-direction: column;
            gap: 20px;
        }

        .content .content-logo{
            img{
                width: 70px;
            }
            
            .project-name {
                font-size: 1rem;
            }
        }

        .content .content-midias-socials .content-button-circle{
            position: absolute;
            right: -20px;
            top: 20px;
        }
    }

    @media(max-width: 500px){
        .content .content-description{
            span{
                font-size: 16px;
            }
        }
    }
`