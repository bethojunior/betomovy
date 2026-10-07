import styled from "styled-components";

export const Container = styled.div`
  .body {
    width: 100%;
    height: 100%;
    transition: all ease 1.5s;
    margin-right: 30px;
    cursor: pointer;
    padding: 10px;
  }

  .header {
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    padding-top: 10px;
  }

  .title {
    white-space: nowrap;
    font-size: 30px;
  }

  .sub-title {
    font-size: 20px;
  }

  .list {
    margin-top: 20px;
    overflow-y: auto;
    padding-right: 20px;
    height: 400px;
    min-height: 400px;
  }

  .footer-container {
    padding: 10px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    border-radius: 9.2px;
    box-shadow: 0px -7px 15px -3px rgba(0, 0, 0, 0.1),
      0px 10px 15px -3px rgba(0, 0, 0, 0.1),
      0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .payment {
    width: 150%;
    height: 45px;
    display: flex;
    align-items: center;
  }

  .select-payment {
    width: 90%;
    height: 40px;
    border-radius: 9.2px;
    padding: 10px;
  }
`;
