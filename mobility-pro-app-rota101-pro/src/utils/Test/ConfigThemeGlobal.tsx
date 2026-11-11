import { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import clientTheme from '../../client/styles/theme';
import { ThemeProvider } from 'styled-components/native';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const renderWithTheme = (component: ReactElement, theme: any = clientTheme) => render(
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </SafeAreaProvider>
  )
