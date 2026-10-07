import { Container, Dot } from './styles';

import { useTheme } from 'styled-components';

const LoadingDots = () => {

  const { colors } = useTheme();;

  return (
    <Container>
      <Dot
        key="dot1"
        from={{
          scale: 1,
          backgroundColor: colors.primary,
        }}
        animate={{
          scale: 2.3,
          backgroundColor: colors.primary,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1000,
          delay: 0,
        }}
      />
      <Dot
        key="dot2"
        from={{
          scale: 1,
          backgroundColor: colors.primary,
        }}
        animate={{
          scale: 2.3,
          backgroundColor: colors.primary,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1000,
          delay: 200
        }}
      />
      <Dot
        key="dot3"
        from={{
          scale: 1,
          backgroundColor: colors.primary,
        }}
        animate={{
          scale: 2.3,
          backgroundColor: colors.primary,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1000,
          delay: 400
        }}
      />
    </Container>
  );
};

export default LoadingDots;
