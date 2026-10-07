import styled from "styled-components";
import { colors } from "../../theme/colors";

export const Container = styled.div`
  position: absolute;
  top: 0;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  background-color: ${colors.black_transparency};

  display: flex;
  align-items: center;
  justify-content: center;

  .content-modal-encerred {
    max-width: 800px;
    width: 100%;
    background-color: white;
    padding: 1rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;

    a {
      display: block;
      font-size: 16px;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      border: 1px solid ${colors.black};
      color: ${colors.white};
      background-color: ${colors.black};
      cursor: pointer;
      text-decoration: none;

      :hover {
        transition: all ease 0.3s;
        color: ${colors.black};
        background-color: ${colors.white};
        cursor: pointer;
      }
    }
  }
`;
