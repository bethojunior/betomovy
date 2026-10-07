import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import { useCountdown } from '../../hooks/useCountdown';

const InfoContainer = styled(View)``;

const Value = styled(Text)`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

interface ExpirationCountdownProps {
  seconds?: number;
  onExpire?: () => void;
}

export const ExpirationCountdown = ({ seconds = 300, onExpire }: ExpirationCountdownProps) => {
  const { formattedTime } = useCountdown(seconds, onExpire);

  return (
    <InfoContainer>
      <Value>{formattedTime}</Value>
    </InfoContainer>
  );
}

export default ExpirationCountdown;
