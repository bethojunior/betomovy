import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .chat-container {
    width: 350px;
    height: 550px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
    z-index: 1;
  }

  .img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .header-container {
    border-bottom: 1px solid #d8d8d8;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .driver-data {
    display: flex;
    align-items: center;
  }

  .pointer {
    cursor: pointer;
  }

  .body-container {
    height: 460px;
    max-height: 460px;
    margin-top: 10px;
    padding: 10px 5px 5px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .messages-container {
    font-family: system-ui, sans-serif;
    /* background-color: blue; */
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  .bubble {
    --r: 0.5em; /* the radius */
    --t: 1.3em; /* the size of the tail */

    max-width: 300px;
    padding: 0.5em;
    border-inline: var(--t) solid #0000;
    border-radius: calc(var(--r) + var(--t)) / var(--r);
    mask: radial-gradient(100% 100% at var(--_p) 0, #0000 99%, #000 102%)
        var(--_p) 100% / var(--t) var(--t) no-repeat,
      linear-gradient(#000 0 0) padding-box;
    background: grey;
    color: #fff;
    word-break: break-all;
  }

  .left {
    --_p: 0;
    border-bottom-left-radius: 0 0;
    place-self: start;
  }
  .right {
    --_p: 100%;
    border-bottom-right-radius: 0 0;
    place-self: end;
    background-color: green;
    /* opacity: 0.5; */
  }

  .input-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #d8d8d8;
    padding-top: 10px;
  }

  .text-send {
    width: 90%;
    height: 30px;
    padding: 10px;
    border-radius: 10px;
  }

  .space {
    margin-bottom: 10px;
  }

  .send-button {
    background: transparent;
    border: none;
  }
`;
