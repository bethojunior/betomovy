import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .card {
    height: auto;
    width: 80%;
    border: 1px solid #e8e8e8;
    border-radius: 18px;
    padding: 10px;
    margin-top: 50px;
  }
  .title {
    font-size: 20px;
  }
  .search-container {
    display: flex;
    flex-direction: column;
    padding: 0px !important;
    margin-bottom: 15px;
  }
  .input-wrapper {
    position: relative;
    margin-top: 15px;
  }
  .input {
    height: 40px;
    width: 100%;
    border-radius: 9.2px;
    border: none;
    padding-left: 40px;
    padding-right: 40px;
    background-color: #e8e8e8;
  }

  .icon-wrapper {
    position: absolute;
    top: 50%;
    bottom: 50%;
    left: 5px;
    transform: translateY(-50%);
    width: 30px;
    text-align: center;
    padding-bottom: 15px;
  }
  .icon-rigth {
    position: absolute;
    top: 50%;
    bottom: 50%;
    right: 5px;
    transform: translateY(-50%);
    width: 30px;
    text-align: center;
    cursor: pointer;
    padding-bottom: 15px;
  }

  .icon-rigth-person {
    position: absolute;
    top: 50%;
    bottom: 50%;
    right: 46%;
    transform: translateY(-50%);
    width: 30px;
    text-align: center;
    cursor: pointer;
    padding-bottom: 15px;
  }

  .input-person {
    height: 40px;
    width: 55%;
    border-radius: 9.2px;
    border: none;
    padding-left: 40px;
    background-color: #e8e8e8;
  }

  .icon {
    color: #000;
  }

  @media (max-width: 1024px) {
    .card {
      width: 100%;
      margin-top: 0px;
      border: none;
    }
  }
`;
