import styled from "styled-components";

export const Container = styled.footer`
    background-color: var(--color-white);
    padding: 1.5rem 3rem;
    border-top: 1px solid #e2e8f0;

    .content{
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1280px;
        margin: 0 auto;
        position: relative;
    }

    .content .content-logo{
        a {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.85;
            }
        }
        
        img{
            height: 42px;
            width: auto;
            max-width: 120px;
            object-fit: contain;
            display: block;
        }
        
        .project-name {
            font-size: 1.35rem;
            font-weight: 700;
            color: #0f172a;
            text-transform: capitalize;
            white-space: nowrap;
            letter-spacing: -0.3px;
        }
    }

    .content .content-description{
        span{
            display: block;
            font-size: 14px;
            color: #64748b;
            text-align: center;
            font-weight: 400;
        }

        .footer-link-privacy {
            display: inline-block;
            margin-top: 0.25rem;
            font-size: 13px;
            font-weight: 500;
            color: var(--color-primary);
            text-decoration: none;
            text-align: center;
            transition: color 0.2s;
        }

        .footer-link-privacy:hover {
            text-decoration: underline;
            color: var(--color-secondary);
        }
    }

    .content .content-midias-socials{
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .content .content-midias-socials .content-button-circle{
        cursor: pointer;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(31, 85, 121, 0.25);
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(31, 85, 121, 0.35);
        }

        &:active {
            transform: translateY(0);
        }
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