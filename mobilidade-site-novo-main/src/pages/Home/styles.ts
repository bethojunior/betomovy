import styled from "styled-components";

export const Container = styled.div`
    .content-banner{
        width: 100%;
        background-image: url('../../assets/img/Banner_1366x688.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;

        padding: 5rem 0;
    }

    .content-banner .content{
        padding: 0 8rem;

        h1{
            font-size: 70px;
            color: var(--color-white);
            text-align: center;
            margin: 2rem 0;
        }

        p{
            font-size: 35px;
            text-align: center;
            color: var(--color-white);
            font-weight: 500;
        }
    }

    .content-banner .content .content-buttons{
        width: 100%;
        margin: 2rem 0;
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .content-description-website{
        width: 100%;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 8rem;
        margin: 2rem 0;
    }

    .content-description-website .content-img{
        img{
            width: 250px;
        }
        
        flex: 0.8;
        text-align: center;
    }

    .content-description-website .description{
        flex: 1;
        p{
            margin: 1rem 0;
            font-size: 30px;
            color: var(--color-primary);
        }
    }

    .content-doubts{
        width: 100%;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: var(--color-black);
    }

    .content-doubts .content-column-1{
        color: var(--color-white);
        h1{
            font-size: 60px;
        }

        span{
            font-size: 25px;
        }
    }

    .content-doubts .content-column-2 form {
        button{
            width: 100%;
        }

        span{
            display: block;
            margin: 0.5rem 0;
            color: red;
            font-size: 16px;
        }
    }

    .content-doubts .content-column-2 form .content-inputs{
        display: flex;
        gap: 20px;
        input{
            padding: 0.8rem 1rem;
            font-size: 20px;
            outline: none;
            border: none;
            border-radius: 5px;
        }
    }

    .content-doubts .content-column-2 form .content-textarea{
        margin: 1rem 0;

        textarea{
            width: 100%;
            height: 150px;
            border-radius: 5px;
            padding: 1rem;
            outline: none;
            font-size: 20px;
        }
    }

    @media(max-width: 986px){
        .content-banner{
            width: 100%;
        }

        .content-banner .content{
            h1{
                font-size: 50px;
            }

            p{
                font-size: 20px;
            }
        }

        .content-description-website{
            display: flex;
            align-items: center;
            flex-direction: column;
        }

        .content-description-website .content-img{
            flex: 1;
            img{
                width: 300px;
            }
        }

        .content-description-website .description{
            p{
                text-align: center;
                font-size: 20px;
            }
        }

        .content-doubts{
            flex-direction: column;
            gap: 40px;
        }

        .content-doubts .content-column-1{
            color: var(--color-white);
            h1{
                font-size: 40px;
                text-align: center;
            }

            span{
                margin-top: 1rem;
                display: block;
                font-size: 15px;
                text-align: center;
            }
        }

        .content-doubts .content-column-2 form {
            button{
                width: 100%;
            }
        }

        .content-doubts .content-column-2 form .content-inputs{
            input{
                font-size: 16px;
            }
        }

        .content-doubts .content-column-2 form .content-textarea{
            margin: 1rem 0;

            textarea{
                font-size: 16px;
            }
        }
    }

    @media(max-width: 768px){
        .content-banner .content{
            padding: 0 3rem;
        }

        .content-description-website{
            padding: 1rem;
        }

        .content-description-website .content-img{
            img{
                width: 200px;
            }
        }

        .content-doubts .content-column-2 form .content-inputs{
            display: flex;
            flex-wrap: wrap;

            > div{
                width: 100%;
            }

            input{
                width: 100%;
            }
        }
    }

    @media(max-width: 500px){
        .content-banner .content{
            padding: 0 2rem;

            h1{
                font-size: 35px;
            }

            p{
                font-size: 15px;
            }
        }

        .content-banner .content .content-buttons{
            flex-direction: column;
            align-items: center;
        }
        
        .content-doubts .content-column-1{
            color: var(--color-white);
            h1{
                font-size: 30px;
            }

            span{
                font-size: 15px;
            }
        }
    }
`