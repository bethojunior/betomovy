import styled from "styled-components";

interface ContainerProps {
  width: number;
}
export const Container = styled.div<ContainerProps>`
  background-color: #e0e0e0;
  display: flex;
  justify-content: flex-start;
  margin: 10px;
  height: 40px;
  position: relative;

  .progress-bar {
    background-color: #4caf50;
    width: ${({ width }) => (width >= 100 ? "100%" : `${width}%`)};
    height: 100%;
    transition: 1s all ease;
  }

  .title-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .time-title {
    color: #fff;
  }
`;
