import styled from "styled-components";

export const Container = styled.div`
  .body {
    display: flex;
    height: 100vh;
    flex-direction: column;
  }
  .general-container {
    padding-top: 20px;
    height: 100%;
    display: flex;
  }
  .left-container {
    width: auto;
    height: 100%;
    display: flex;
  }
  .search-container {
    display: flex;
    justify-content: end;
    padding-right: 40px;
    padding-left: 100px;
    background-color: #fff;
    z-index: 1;
  }
  .right-container {
    width: 100%;
  }

  .scroll {
    ::-webkit-scrollbar {
      width: 7px !important;
      height: 10px;
      display: block !important;
    }
    ::-webkit-scrollbar-thumb {
      background: #d3d3d3 !important;
      border-radius: 5px !important;
    }
  }

  .button {
    width: 100%;
    height: 40px;
    border-radius: 9.2px;
    border: none;
    color: #fff;
    background-color: #000;
  }

  .pointer {
    cursor: pointer;
  }

  .bolder {
    font-weight: bolder;
  }

  .select {
    appearance: none;
  }

  .colors-cont {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .yellow-cont {
    display: flex;
    height: 100%;
    /* background-color: blue; */
    transition: 1s ease all;
  }
  .red-cont {
    height: 100%;
    width: 100%;
    position: relative;
  }

  @media (max-width: 1024px) {
    .colors-cont {
      flex-direction: column-reverse;
    }

    .yellow-cont {
      height: auto;
      width: 100%;
    }

    .red-cont {
      height: auto;
      width: 100%;
      height: 100%;
    }
  }
`;

interface SearchContainerProps {
  width: string;
}
export const SearchContainer = styled.div<SearchContainerProps>`
  display: flex;
  height: 100%;
  transition: 1s ease all;
  width: ${({ width }) => width};

  @media (max-width: 1024px) {
    height: auto;
    width: 100%;
  }
`;
