import styled from "styled-components";

export const Container = styled.div`
  width: 300px;
  height: auto;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .payments-container {
    padding-top: 15px;
    border-bottom: 1px solid #d8d8d8;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }

  .payments {
    display: flex;
    align-items: center;
    padding: 5px;
  }

  .payment-item {
    margin-left: 10px;
  }

  .btn-container {
    display: flex;
    justify-content: flex-end;
  }

  .add-card {
    color: #fff;
    cursor: pointer;
    background-color: yellowgreen;
    border: none;
    padding: 5px 10px 5px 10px;
    border-radius: 5px;
  }

  .balance-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .balance-label {
    font-size: 13px;
  }
  .balance-value {
    font-size: 15px;
  }

  .voucher-card {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    background-color: #d8d8d8;
    margin-top: 10px;
  }

  .percent {
    background-color: #000;
    padding: 10px;
    color: #fff;
    border-radius: 100%;
  }

  .values-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-left: 10px;
  }
  .values {
    display: flex;
    flex-direction: column;
    width: 80%;
  }

  .small {
    font-size: 12px;
  }

  .nowrap {
    white-space: nowrap;
  }
`;
