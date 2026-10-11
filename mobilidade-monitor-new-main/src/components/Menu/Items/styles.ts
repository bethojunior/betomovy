import styled from "styled-components";
import SubMenu from "antd/es/menu/SubMenu";

export const SubMenuStyle = styled(SubMenu)``;

const LAYER_CRISP_CLOSE_FAB = 10_000_002;

/** Botão externo para fechar o painel do Crisp (SDK: do chat:close). */
export const CrispChatCloseFab = styled.button`
  position: fixed;
  z-index: ${LAYER_CRISP_CLOSE_FAB};
  bottom: 76px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  &:hover {
    background: #fafafa;
    color: rgba(0, 0, 0, 0.65);
    border-color: rgba(0, 0, 0, 0.12);
  }

  &:focus-visible {
    outline: 2px solid #1890ff;
    outline-offset: 2px;
  }
`;

const styles = `
  .custom-swal .swal-title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
  }
  .custom-swal .swal-text {
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  .swal-centered-text .swal-text {
    text-align: center;
  }
  .btn-cancel {
    background-color: #f0f0f0;
    color: #000;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
  }
  .btn-confirm {
    background-color: #d33;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
  }
  .menu-mobile {
    padding: 10px 0 40px 0 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
  }
  .menu-mobile::-webkit-scrollbar {
    width: 6px;
  }
  .menu-mobile::-webkit-scrollbar-track {
    background: transparent;
  }
  .menu-mobile::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 4px;
  }
  .menu-mobile::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.45);
  }
  @media (max-width: 768px) {
    .menu-mobile {
      display: flex !important;
      flex-direction: column !important;
      padding: 60px 0 40px 0 !important;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);