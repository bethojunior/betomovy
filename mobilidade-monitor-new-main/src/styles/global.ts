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
      background: #F8FAFC;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

      .ant-menu.ant-menu-sub.ant-menu-vertical {
        display: none;
      }
   }

   /* ── Ant Design Menu Sidebar (Tema Corporativo MOVY) ── */
   .ant-layout-sider {
      background: #070A1A !important;
   }

   .ant-menu.ant-menu-dark,
   .ant-menu-dark .ant-menu-sub,
   .ant-menu.ant-menu-dark .ant-menu-sub {
      background: #070A1A !important;
      color: #94A3B8 !important;
   }

   .ant-menu-dark .ant-menu-item,
   .ant-menu-dark .ant-menu-submenu-title {
      color: #CBD5E1 !important;
      border-radius: 8px !important;
      margin: 3px 8px !important;
      width: calc(100% - 16px) !important;
      font-weight: 600 !important;
      font-size: 13.5px !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
   }

   /* REGRA ABSOLUTA: Hover em botões e itens de menu DEVE SER PRETO (#111111) com texto/ícone ciano (#04F3FA) */
   .ant-menu-dark .ant-menu-item:hover,
   .ant-menu-dark .ant-menu-submenu-title:hover {
      background-color: #111111 !important;
      color: #04F3FA !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;

      a {
        color: #04F3FA !important;
      }

      .ant-menu-item-icon, svg {
        color: #04F3FA !important;
      }
   }

   .ant-menu-dark .ant-menu-item-selected {
      background-color: #00349A !important;
      color: #FFFFFF !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 14px rgba(0, 52, 154, 0.4) !important;

      a {
        color: #FFFFFF !important;
      }
   }

   /* ── Botões Globais: Hover PRETO (#111111) com acento Ciano ── */
   .ant-btn-primary:not(:disabled):hover {
      background-color: #111111 !important;
      border-color: #04F3FA !important;
      color: #04F3FA !important;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5) !important;
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
