import styled from "styled-components";

export const MockupContainer = styled.div`
  position: relative;
  width: 350px;
  margin: 0 auto;
  padding: 10px;
`;

export const MockupImage = styled.img`
  position: absolute;
  width: 100%;
  height: auto;
  z-index: 2;
`;

export const MockupContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  position: absolute;
  width: 92.3%;
  right: 1.2%;
  top: 26.3px;
  padding-bottom: 20px;
  z-index: 2;
`;

export const Content = styled.div`
  background-color: #f5f5f5;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding: 20px;
  margin-top: -100px;
  max-height: 490px;
`;

export const MockupTitle = styled.h1`
  text-align: center;
  font-size: 22px;
  max-height: 50px;
  overflow-y: auto;
  white-space: normal;
  word-wrap: break-word;
`;

export const MockupText = styled.p`
  margin-top: 25px;
  margin-bottom: 25px;
`;

export const MockupSectionTitle = styled.h2`
  border-bottom: 1px solid gray;
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-size: 18px;
`;

export const MockupList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;
  max-height: 100px;
  overflow-x: hidden;
  padding-left: 20px;
  margin-bottom: 25px;
`;

export const MockupSubtitleContainer = styled.div`
  max-height: 70px;
  overflow-y: auto;
  word-break: break-word;
`;

export const MockupListItem = styled.li`
  flex: 1 1 100%; 
  min-width: 200px;
  max-width: 100%; 
  white-space: normal;
  word-wrap: break-word;
`;

export const MockupButton = styled.button`
  width: 40%;
  margin-left: 20px;
  margin-top: 15px;
  padding: 7px 0;
  border-radius: 5px;
  border: none;
  background-color: #0250c4;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  z-index: 2;
`;

export const StyledImage = styled.img`
  width: 100%;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;
