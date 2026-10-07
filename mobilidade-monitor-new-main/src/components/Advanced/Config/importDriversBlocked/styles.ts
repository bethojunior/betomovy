
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  width: 90%;
  margin: 0 auto;
`;

export const ContentContainer = styled.div`
  background-color: white;
  padding: 30px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .description {
    font-size: 1.2em;
  }
`;

export const ModalBody = styled.div`
  max-height: 500px;
  overflow: auto;
`;

export const TableContainer = styled.div`
  max-height: 300px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
`;