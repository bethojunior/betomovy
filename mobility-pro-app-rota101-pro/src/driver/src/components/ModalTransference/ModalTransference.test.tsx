import { renderWithTheme } from '../../../../utils/Test/ConfigThemeGlobal';
import {ModalTransference} from './index';

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
