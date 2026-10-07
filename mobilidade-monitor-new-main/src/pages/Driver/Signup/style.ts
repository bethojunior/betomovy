import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
`;

export const Iframe = styled.iframe`
  width: 100%;
  height: 100vh;
  border: none;
`;

export const Header = styled.header`
  text-align: center;
  background-color: #27283c;
  padding: 1rem;

  > h1 {
    font-size: 20px;
    color: #f1f1f1;
    font-weight: bold;
  }
`;

export const ContentList = styled.ul`
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ListCategory = styled.li`
  width: 70%;
  border: 1px solid #0000005d;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;

  img {
    width: 100px;
  }

  span {
    margin: 0 1rem;
  }

  a {
    border: none;
    font-size: 25px;
    cursor: pointer;
    text-decoration: none;
    color: #000;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;
