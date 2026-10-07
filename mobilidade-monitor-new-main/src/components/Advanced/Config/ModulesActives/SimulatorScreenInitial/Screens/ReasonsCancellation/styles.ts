import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
`;

export const ModalReasons = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 240px;
  position: absolute;
  bottom: 0px;
  border-radius: 15px 15px 20px 20px;
  padding: 1rem 0.8rem;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
`;

export const HeaderModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 12px;
  }
`;

export const TitleModal = styled.span<{ colorText: string }>`
  font-size: 12px;
  font-weight: bold;
  color: ${({ colorText }) => colorText};
`;

export const ContainerItems = styled.div`
  > span {
    font-size: 12px;
    line-height: 15px;
    margin: 1rem 0;
    display: block;
  }
`;

export const Item = styled.button<{
  selected: boolean;
  backgroundColor: string;
  colorText: string;
}>`
  font-size: 12px;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 1px solid gray;
  padding: 0.5rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ selected, backgroundColor }) =>
    selected ? backgroundColor : "none"};
  color: ${({ selected, colorText }) => (selected ? colorText : "black")};
`;

export const ContentItems = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 92px;

  ::-webkit-scrollbar {
    width: 3px !important;
    height: 10px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #5c5c5c !important;
    border-radius: 5px !important;
  }
`;

export const ContentButtonsModal = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.7rem 0;
`;

export const ButtonAction = styled.button<{
  backgroundColor: string;
  colorText: string;
}>`
  width: 100%;
  padding: 0.7rem;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ colorText }) => colorText};
  border: none;
  border-radius: 3px;
  font-size: 12px;
`;
