import styled from "styled-components";

export const Container = styled.div`
    h1{
        font-size: 30px;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .content-documents-requisited{
        > input{
            width: 100%;
            display: block;
            outline: none;
            padding: 0.8rem 1rem;
            font-size: 20px;
            margin: 1rem 0;
        }
    }

    .content-documents-requisited .content-input-file{
        label{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 1rem 0;
            cursor: pointer;
            padding: 1rem;
            cursor: pointer;
            background-color: #E8E8E8;
            border-radius: 8px;
        }

        input[type=file]{
            display: none;
        }
    }

    .content-document-choosed{
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        border: 1px solid var(--color-black);
        background: #f5f5f5;
        
        img{
            width: 100%;
            height: 400px;
            object-fit: contain;
        }

        &.pdf-container {
            height: 400px;
            position: relative;
        }

        .pdf-preview {
            width: 100%;
            height: 100%;
            position: relative;
            
            .pdf-card {
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                
                .pdf-name-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 10px;
                    
                    .pdf-name {
                        font-size: 16px;
                        font-weight: bold;
                        max-width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            
            .pdf-viewer {
                width: 100%;
                height: 100%;
                
                object {
                    width: 100%;
                    height: 100%;
                    border: none;
                    background: white;
                }
            }
        }
        
        .pdf-not-supported {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 20px;
            background: white;
            
            p {
                margin: 5px 0;
                font-size: 16px;
                text-align: center;
            }
            
            .pdf-name-container {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 10px;
                
                .pdf-name {
                    font-weight: bold;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

      .animate-spin {
    animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
        transform: rotate(360deg);
        }
    }

    .content-button{
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

            :disabled{
                opacity: 0.5;
            }
        }
    }

    @media (max-width: 768px) {
        .content-document-choosed {
            &.pdf-container {
                height: auto;
                border-radius: 10px;
            }
            
            .pdf-preview {
                .pdf-card {
                    display: flex;
                }
                
                .pdf-viewer {
                    display: none;
                }
            }
        }
    }
`