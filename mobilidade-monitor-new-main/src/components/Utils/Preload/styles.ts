import styled from "styled-components";

interface SquadProps {
  change: number;
}

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  z-index: 1;
  justify-content: center;
  align-items: center;
`;

export const Section1 = styled.div`
  flex-direction: row;
`;

export const Section2 = styled.div`
  flex-direction: row;
  display: flex;
  position: absolute;
`;

export const Squad1 = styled.div<SquadProps>`
  height: 60px;
  width: 60px;
  margin-left: 20px;
  margin-bottom: 8px;
  border: 4px solid #0b4875;
  border-radius: 18px;
  opacity: ${({ change }) => (change === 1 ? 0.5 : 1)};
`;

export const Squad2 = styled.div<SquadProps>`
  height: 80px;
  width: 80px;
  border: 4px solid #0b4875;
  border-radius: 18px;
  opacity: ${({ change }) => (change === 3 ? 0.5 : 1)};
`;

export const Squad4 = styled.div<SquadProps>`
  height: 90px;
  width: 90px;
  border: 4px solid #96c332;
  border-radius: 18px;
  opacity: ${({ change }) => (change === 2 ? 0.5 : 1)};
`;

export const Squad3 = styled.div<SquadProps>`
  height: 60px;
  width: 60px;
  margin-left: 35px;
  margin-right: 10px;
  border: 4px solid #96c332;
  border-radius: 18px;
  opacity: ${({ change }) => (change === 4 ? 0.5 : 1)};
`;
