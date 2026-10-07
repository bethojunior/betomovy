import { Content } from "./styles";

interface IconLinkProps {
  link: string;
  icon: string;
}

export const IconLink = ({ icon, link }: IconLinkProps) => {
  return (
    <a target="_blank" href={link}>
      <Content style={{ backgroundImage: `url(${icon})` }} />
    </a>
  );
};
