import styled from "styled-components";

import { Carousel as CarouselAntd } from "antd";

export const Container = styled.div`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Carousel = styled(CarouselAntd)`
  margin: 2rem 0;

  > .slick-dots li button {
    margin-top: 1rem;
    background-color: gray;
    height: 5px;
  }
  > .slick-dots li.slick-active button {
    background-color: #1677ff;
  }
`;

export const TitlePublicity = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 1rem 0;
`;

export const Label = styled.p`
  font-size: 18px;
`;

export const ContentBanner = styled.div`
  display: flex;
  justify-content: center;
`;

export const Banner = styled.img`
  width: 600px;
  height: 300px;
  border-radius: 10px;
  justify-self: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
    object-fit: fill;
  }

  @media (max-width: 500px) {
    width: 100%;
    height: 200px;
    object-fit: fill;
  }
`;

export const DescriptionPublicity = styled.p`
  font-size: 18px;
  margin: 0.5rem 0;
`;

export const Footer = styled.footer`
  padding-top: 1rem;
  border-top: 1px solid #bfbfbf;
`;

export const ContentVideos = styled.div`
  margin: 1rem 0;
`;

export const Link = styled.a``;
