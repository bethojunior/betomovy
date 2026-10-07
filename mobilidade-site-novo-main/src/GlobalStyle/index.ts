import { createGlobalStyle } from "styled-components";
import arrowDownSvg from "../assets/svg/arrow-down.svg";

interface StyleProps{
    backgroundColorPrimary: string;
    backgroundColorSecondary: string;
}

export const GlobalStyle = createGlobalStyle<StyleProps>`

    :root{
        --color-primary: ${props => props.backgroundColorPrimary};
        --color-secondary: ${props => props.backgroundColorSecondary};
        --color-white: #FFFFFF;
        --color-black: #000000;
        --color-placeholder: #9e9e9e;
        --arrow-svg: url(${arrowDownSvg});
    }

    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    body{
        font-family: 'Roboto', sans-serif;
        /* width */
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--color-primary);
        }

        ::-webkit-scrollbar-thumb:hover {
            transition: all ease 0.5s;
            background: var(--color-secondary);
        }
    }

`