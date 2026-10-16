import { forwardRef, useImperativeHandle, useState } from 'react';
import { Container, Dot } from './styles';

export interface PaginationDotsHandle {
  setActiveIndex: (index: number) => void;
}

interface Props {
  total: number;
  initialIndex?: number;
  dotSize?: number;
  spacing?: number;
  activeColor?: string;
  inactiveColor?: string;
}

const PaginationDots = forwardRef<PaginationDotsHandle, Props>(function PaginationDots(
  {
    total,
    initialIndex = 0,
    dotSize = 6,
    spacing = 4,
    activeColor = '#000',
    inactiveColor = 'rgba(0, 0, 0, 0.3)',
  },
  ref,
) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useImperativeHandle(ref, () => ({ setActiveIndex }), []);

  if (total <= 1) return null;

  return (
    <Container spacing={spacing}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot
          key={index}
          size={dotSize}
          color={index === activeIndex ? activeColor : inactiveColor}
        />
      ))}
    </Container>
  );
});

export default PaginationDots;
