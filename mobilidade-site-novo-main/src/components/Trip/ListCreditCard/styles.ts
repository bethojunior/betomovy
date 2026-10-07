import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .comp {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    width: auto;
  }

  .card {
    height: auto;
    width: auto;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    display: flex;
  }

  .rccs {
    margin: 0px !important;
    margin-right: 30px !important;
  }

  .close {
    cursor: pointer;
  }

  .form {
    display: flex;
    justify-content: flex-start;
    align-items: end;
    flex-direction: column;
  }

  .input {
    height: 30px;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: none;
    border-bottom: 1.5px solid #d8d8d8;

    :focus {
      outline: none;
      border-bottom: 1px solid #000;
    }
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .small {
    width: 25%;
  }

  .medium {
    width: 70%;
  }

  .btn-container {
    margin-top: 20px;
    width: 100%;
  }

  .btn {
    width: 100%;
    height: 40px;
    border-radius: 9.2px;
    border: none;
    background-color: #000;
    color: #fff;
    font-weight: bolder;
    cursor: pointer;

    /* :hover {
      background-color: #d3d3d3;
    } */
  }
`;
