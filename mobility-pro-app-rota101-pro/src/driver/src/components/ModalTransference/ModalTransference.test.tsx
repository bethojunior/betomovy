import { renderWithTheme } from '../../../../utils/Test/ConfigThemeGlobal';
import {ModalTransference} from './index';

jest.mock('../../../../client/components/BottomSheetModal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BottomSheetModal: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, null, children),
  };
});

describe('ModalTransference', () => {
  it('renderiza corretamente com os valores iniciais', () => {
    const {getByTestId} = renderWithTheme(
      <ModalTransference
        visible
        setVisible={() => {}}
        currentSald={0}
        realodBalance={() => {}}
      />,
    );
    expect(getByTestId('input_money_test')).toBeTruthy();
  });
});
