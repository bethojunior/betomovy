import styled from "styled-components";

export const Container = styled.div`
  .content-map {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;

export const MapTripViewport = styled.div`
  position: absolute;
  inset: 0;
  transition: all ease 1.5s;
`;

export const DriverMarkerImage = styled.img`
  display: block;
  width: 48px;
  height: 48px;
`;

export const MapRouteOriginDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #4264fb;
  border: 2px solid #ffffff;
`;

export const MapRouteDestinationDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff0000;
  border: 2px solid #ffffff;
`;
