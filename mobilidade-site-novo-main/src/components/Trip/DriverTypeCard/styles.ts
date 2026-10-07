import styled from "styled-components";

export const Container = styled.div`
  .card {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 9.2px;
    margin-bottom: 15px;
    border: 1.5px solid #000;
  }

  .type-info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    font-size: 12px;
    width: 70%;
  }

  .type-name {
    font-size: 20px;
  }

  .description {
    color: #808080;
  }

  .info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .price {
    white-space: nowrap;
  }
`;
