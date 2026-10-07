import styled from "styled-components";

export const Container = styled.div`
  .header-container {
    display: flex;
    align-items: center;
    border-bottom: 5px solid #e8e8e8;
    position: relative;
  }
  .logo-container {
    width: auto;
    display: flex;
    align-items: center;
    padding: 2px;
  }
  .menu-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .first-section {
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item-container {
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;

    :hover {
      background-color: #e8e8e8;
    }
  }
  .icon {
    margin-bottom: -2.5px;
  }
  .menu-item-label {
    margin-left: 10px;
  }
  .share-icon {
    cursor: pointer;
  }
  .my-trips-icon {
    cursor: pointer;
    margin-right: 10px;
  }
  .second-container {
    width: 20rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .align-container {
    display: flex;
    align-items: center;
  }
  .perfil-picture {
    background-color: #ddd;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (max-width: 600px) {
    .logo {
      margin-left: 0px;
    }
    .header-container {
      padding: 5px;
      justify-content: space-between;
    }
  }
`;
