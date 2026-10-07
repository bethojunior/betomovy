import styled from 'styled-components';

export const Content = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 24px;

  label {
    font-weight: 500;
    color: #333;
  }

  .ant-input,
  .ant-input:focus,
  .ant-input-focused {
    border-color: #d9d9d9;
  }

  .ant-upload {
    width: 100%;
    
    .ant-btn {
      width: 100%;
    }
  }
`;