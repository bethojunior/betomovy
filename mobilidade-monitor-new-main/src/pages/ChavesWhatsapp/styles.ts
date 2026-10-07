import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Header = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

export const DataSection = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

export const FormSection = styled.form`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 20px;

  h3 {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 15px 0;
    border-bottom: 2px solid #1890ff;
    padding-bottom: 8px;
  }
  h4 {
    margin: 16px 0 8px 0;
    color: #333;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;

  label {
    color: #444;
    font-size: 14px;
    width: 100px;
  }
`;

export const Input = styled.input`
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 14px;
  outline: none;
  &:focus { border-color: #1890ff; box-shadow: 0 0 0 2px rgba(24,144,255,0.2); };
  min-width: 300px;
`;

export const labelChave = styled.label`
  color: #444;
  font-size: 14px;
  width: 100px;
`;

export const Select = styled.select`
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 14px;
  outline: none;
`;

export const SwitchDefault = styled.input`
  margin-right: 24px
`;

export const SmallButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border: 1px solid #1890ff;
  background: #1890ff;
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const SubmitRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 32px;
`;

export const DataCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  
  h3 {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 15px 0;
    border-bottom: 2px solid #1890ff;
    padding-bottom: 8px;
  }
  
  p {
    margin: 8px 0;
    color: #666;
    font-size: 14px;
    
    strong {
      color: #333;
      font-weight: 600;
    }
  }
`;

export const KeyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const KeyItem = styled.div<{ isDefault: boolean }>`
  background: ${props => props.isDefault ? '#e6f7ff' : '#f9f9f9'};
  border: 1px solid ${props => props.isDefault ? '#1890ff' : '#d9d9d9'};
  border-radius: 6px;
  padding: 12px;
  cursor: ${props => props.isDefault ? 'default' : 'pointer'};
  transition: background 0.2s ease, box-shadow 0.2s ease;
  
  div {
    margin: 4px 0;
    color: #666;
    font-size: 13px;
    
    strong {
      color: #333;
      font-weight: 600;
    }
  }
  
  &:hover {
    background: ${props => props.isDefault ? '#e6f7ff' : '#f5f5f5'};
    box-shadow: ${props => props.isDefault ? 'none' : '0 2px 6px rgba(0,0,0,0.06)'};
  }

  .activeTag {
    background: #1890ff;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
  }
`;

export const LoadingMessage = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #1890ff;
  font-size: 16px;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  background: #fff2f0;
  border: 1px solid #ffccc7;
  padding: 20px;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 14px;
  text-align: center;
`;
