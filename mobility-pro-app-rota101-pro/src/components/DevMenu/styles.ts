import styled, {css} from 'styled-components/native';

export const colors = {
  blue: '#007AFF',
  red: '#E83F5B',
};

export const SectionWrapper = styled.View`
  margin-top: 24px;
  padding: 0 16px;
`;

export const SectionLabel = styled.Text`
  font-family: MavenPro_500Medium;
  font-size: 12px;
  color: ${({theme}) => theme.colors.text_gray};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
  padding-left: 4px;
`;

export const Group = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  overflow: hidden;
`;

const rowBase = css<{last?: boolean}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  padding: 10px 16px;
  border-bottom-width: ${({last}) => (last ? 0 : 1)}px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const Row = styled.View<{last?: boolean}>`
  ${rowBase}
`;

export const ActionRow = styled.TouchableOpacity<{last?: boolean; danger?: boolean}>`
  ${rowBase}
  background-color: ${({theme}) => theme.colors.white};
`;

export const Label = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 15px;
  color: ${({theme}) => theme.colors.secondary};
  flex: 1;
`;

export const ValueText = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 15px;
  color: ${({theme}) => theme.colors.text_gray};
`;

export const ActionLabel = styled.Text<{danger?: boolean}>`
  font-family: MavenPro_500Medium;
  font-size: 15px;
  color: ${({danger, theme}) => danger ? theme.colors.red : theme.colors.blue};
`;

export const Badge = styled.View<{ok: boolean}>`
  background-color: ${({ok, theme}) => (ok ? theme.colors.on : theme.colors.off)};
  border-radius: 12px;
  padding: 3px 10px;
`;

export const BadgeText = styled.Text`
  font-family: MavenPro_500Medium;
  font-size: 12px;
  color: #fff;
`;

export const TokenBlock = styled.View<{last?: boolean}>`
  padding: 8px 16px 12px;
  border-bottom-width: ${({last}) => (last ? 0 : 1)}px;
  border-bottom-color: ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.white};
`;

export const TokenText = styled.Text`
  font-family: SourceCodePro_400Regular;
  font-size: 11px;
  color: ${({theme}) => theme.colors.text_gray};
  line-height: 18px;
`;
