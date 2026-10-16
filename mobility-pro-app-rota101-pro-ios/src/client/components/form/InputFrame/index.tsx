import {FC} from 'react';
import {KeyboardTypeOptions, TextInput} from 'react-native';
import {styles} from './styles';

type Props = {
  value: string | undefined;
  keyboradType: KeyboardTypeOptions | undefined;
  setValue(boolean: string): void;
  textAlign?: 'left' | 'right' | 'center';
  editable?: boolean;
  maxLength?: number;
};

const InputFrame: FC<Props> = ({
  value,
  keyboradType,
  setValue,
  textAlign,
  editable,
  maxLength,
}) => {
  return (
    <TextInput
      editable={editable}
      autoCapitalize="characters"
      underlineColorAndroid="transparent"
      keyboardType={keyboradType}
      value={value}
      onChangeText={(text: string) => setValue(text)}
      maxLength={maxLength ?? undefined}
      style={[
        styles.input,
        {borderWidth: editable ? 1 : 0},
        {textAlign: textAlign ?? 'left'},
      ]}
    />
  );
};

export default InputFrame;
