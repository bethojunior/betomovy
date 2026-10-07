import styled from "styled-components";

export const Container = styled.div`
  margin: 1rem 0;

  @media (max-width: 425px) {
    margin: 1rem;
    > h3 {
      font-size: 16px;
      text-align: center;
    }
  }

  input[type="color"] {
    border: none;
    background: none;
    cursor: pointer;
    width: 50px;
    height: 30px;

    ::-webkit-color-swatch {
      width: 100%;
      height: 100%;
    }
  }
`;

export const ContentTable = styled.div`
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 780px;
`;

export const THead = styled.thead`
  width: 100%;
  th {
    font-size: 16px;
    font-weight: normal;
    text-align: left;
    padding: 0.5rem;
  }
  border-bottom: 1px solid #000000;
`;

export const TBody = styled.tbody`
  tr {
    border-bottom: 1px solid #000000;
  }

  td {
    padding: 0.5rem;
    font-size: 16px;
  }

  .visualization {
    cursor: pointer;
    font-size: 16px;
    transform: scale(1);
    :hover {
      transition: all ease 0.3s;
      transform: scale(1.1);
    }
  }
`;

export const ContentInstructions = styled.div`
  margin: 0 1rem;
  @media (max-width: 475px) {
    font-size: 12px;
  }
`;

export const ContentInputGlobalLogo = styled.div`
  margin: 2rem 0;
  label {
    display: block;
    border: 1px solid #000000;
    width: 100px;
    height: 100px;
    cursor: pointer;

    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 3px;
    border-style: dashed;

    transform: scale(1);

    :hover {
      transition: all ease 0.3s;
      transform: scale(1.1);
    }
  }

  h3 {
    font-weight: bold;
    font-size: 20px;
    margin-top: 1rem;
    margin-bottom: 0;
  }
  p {
    margin: 0rem 0;
    font-size: 14px;
  }

  span {
    display: block;
  }

  input {
    display: none;
  }

  @media (max-width: 768px) {
    .content-label-global-input {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      label {
        width: 150px;
        height: 150px;
      }
    }
  }
`;

export const ContentBtnActions = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;
