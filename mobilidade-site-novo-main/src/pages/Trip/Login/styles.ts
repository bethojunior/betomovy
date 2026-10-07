import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;

  .login-container {
    max-width: 400px;
    min-width: 400px;
    padding: 30px 0px 100px 0px;
    position: absolute;
    background-color: #fff;
    right: 0px;
    top: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    width: 200px;
    height: 200px;
    margin-bottom: 50px;
  }

  .form-group {
    margin-bottom: 15px;
    margin-top: 15px;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 40px;
  }

  .erros-input {
    font-size: 14px;
    color: red;
  }

  .password-input-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .toggle-password {
    position: absolute;
    right: 15px;
    width: auto;
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn:hover {
    background-color: #0056b3;
  }

  .register-link {
    margin-top: 30px;
  }
`;
