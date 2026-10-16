import { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import clientTheme from '../../client/styles/theme';
import { ThemeProvider } from 'styled-components/native';

export const renderWithTheme = (component: ReactElement, theme: any = clientTheme) => render(
    <ThemeProvider theme={theme}>{component}</ThemeProvider>
  )
