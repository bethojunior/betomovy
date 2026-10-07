import { FC } from 'react';
import { BlurEvent, KeyboardTypeOptions, TextInput } from 'react-native';
import { styles } from './styles';

type Props = {
  value: string | undefined;
  keyboradType: KeyboardTypeOptions | undefined;
  setValue(boolean: string): void;
  textAlign?: 'left' | 'right' | 'center';
  editable?: boolean;
  maxLength?: number;
  onBlur?(e: BlurEvent): any;
};

const InputFrame: FC<Props> = ({
  value,
  keyboradType,
  setValue,
  textAlign,
  editable,
  maxLength,
  onBlur,
}) => {
  return (
    <TextInput
      editable={editable}
      autoCapitalize="characters"
      underlineColorAndroid="transparent"
      keyboardType={keyboradType}
      value={value}
      onChangeText={(text: string) => setValue(text)}
      onBlur={onBlur}
      maxLength={maxLength ?? undefined}
      style={[
        styles.input,
        { borderWidth: editable ? 1 : 0 },
        { textAlign: textAlign ?? 'left' },
      ]}
    />
  );
};

export default InputFrame;
