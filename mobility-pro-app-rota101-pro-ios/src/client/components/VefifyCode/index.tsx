import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { Text } from 'react-native';

import {Cell, Container} from './styles';

interface VefifyCodeProps {
  cellNumber: number;
  color?: string;
  value: string;
  setValue: (value: string) => void;
}

export function VefifyCode({cellNumber, value, setValue, color}: VefifyCodeProps) {
  const ref = useBlurOnFulfill({value, cellCount: cellNumber});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <Container>
      <CodeField
        ref={ref}
        {...props}
        caretHidden={false}
        value={value}
        onChangeText={setValue}
        cellCount={cellNumber}
        keyboardType="numeric"
        returnKeyType="done"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Cell
            color={color}
            key={index}
            focus={isFocused}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Cell>
        )}
      />
    </Container>
  );
}
