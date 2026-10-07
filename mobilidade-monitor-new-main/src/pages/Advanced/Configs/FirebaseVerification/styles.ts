import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 90%;
  margin: 0 auto;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 2px solid #92C73B;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  margin-left: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
  background: #92C73B;
  color: #fff;
  padding: 10px;
  padding-left: 15px;
  font-size: 24px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: bold;
`;

export const CardBody = styled.div`
  padding: 20px;
  display: flex;
  font-size: 20px;
  align-items: center;
  justify-content: space-between;
`;

interface ButtonProps {
  bgColor: string;
}

export const Button = styled.button<ButtonProps>`
  background-color: ${(props) => props.bgColor};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.9;
  }
`;