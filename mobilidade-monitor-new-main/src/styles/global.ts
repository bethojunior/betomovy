import { createGlobalStyle } from "styled-components";
import colors from "./colors.json";

export default createGlobalStyle`

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: ${colors.black_color};
    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
    transition: background-color 5000s ease-in-out 0s;
  }

   * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      outline: 0;
   }

   body {
      background: #f3f3f3;
      color: #000;
      -webkit-font-smoothing: antialiased;
      font-family: sans-serif;

      .ant-menu.ant-menu-sub.ant-menu-vertical {
        display: none;
      }
   }

    .button-notfication{
      @keyframes notificationColor {
          0% {
              background-color:#cc1c1cb3;
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }

          70% {
              background-color:#f50606;
              box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }

          100% {
              background-color:#cc1c1cb3;
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
      }
    }

    .ant-modal-body > div > .notificationModal {

      ::-webkit-scrollbar {
        width: 7px!important;
        display: block!important;
      }

      ::-webkit-scrollbar-thumb {
        background: #d3d3d3!important;
        border-radius: 5px!important;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #bdbdbd!important;
      }
    }

   @media (max-width: 800px) {
    .crisp-client .cc-kv6t {
      z-index: 1000!important;
    }
   }

   .kcOwHj::-webkit-scrollbar {
      width: 10px;
      display: block;
      overflow-y: scroll !important;
   }

   .kcOwHj::-webkit-scrollbar-thumb {
      background-color: ${colors.main_color_background};
      border-radius: 10px;
      min-height: 70px;
   }

   .jIYALs::-webkit-scrollbar {
      width: 10px;
      display: block;
      overflow-y: scroll !important;
   }

   .jIYALs::-webkit-scrollbar-thumb {
      background-color: ${colors.main_color_background};
      border-radius: 10px;
      min-height: 70px;
   }

   @media (min-width: 800px) {
      ::-webkit-scrollbar {
        width: 12px;
        display: none;
    }

    .ant-layout{
      overflow-x: hidden;
    }

    .ant-layout::-webkit-scrollbar{
        width: 10px;
        display: block;
      }
   }

    .ant-layout::-webkit-scrollbar-thumb {
      background-color: ${colors.main_color_background};
      border-radius: 10px;
      min-height: 70px;
    }

   body, input, button {
      font-size: 16px;
   }

   h1, h2, h3, h4, h5, h6, strong {
      font-weight: 500;
   }

   button {
      cursor: pointer;
   }

   @media (max-width: 800px) {
     .ant-picker-panel-container .ant-picker-panels {
        display: flex !important;
        flex-direction: column;
     }
   }

   .swal-button--approve {
     background-color: #1FC600;
   }

   .swal-button--approve:hover {
     background-color: #19a300;
   }
`;
