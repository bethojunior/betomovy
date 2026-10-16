import styled from 'styled-components/native';

interface ListItemProps {
  width: number;
}

export const Container = styled.View`
  width: 100%;
`;

export const ListItem = styled.View<ListItemProps>`
  width: ${({ width }) => width}px;
  align-items: center;
  justify-content: center;
`;

export const PaginationOverlay = styled.View`
  position: absolute;
  bottom: 8px;
  align-self: center;
  border-radius: 50px;
`;
