import React, {FC} from 'react';
import {KeyboardTypeOptions} from 'react-native';
import {Input} from './styles';

type Props = {
  value: string | undefined;
  keyboradType: KeyboardTypeOptions | undefined;
  setValue(boolean: string): void;
  textAlign?: 'left' | 'right' | 'center' | undefined;
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
    <Input
      editable={editable}
      textAlign={textAlign}
      autoCapitalize="characters"
      keyboardType={keyboradType}
      value={value}
      onChangeText={(text: string) => setValue(text)}
      maxLength={maxLength ? maxLength : null}
    />
  );
};

export default InputFrame;
