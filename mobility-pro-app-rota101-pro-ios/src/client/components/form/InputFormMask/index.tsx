import React, {FC} from 'react';
import {KeyboardTypeOptions, ReturnKeyType} from 'react-native';
import {Controller} from 'react-hook-form';
import {
  TextInputMaskTypeProp,
  TextInputMaskOptionProp,
} from 'react-native-masked-text';
import {Input, Error} from './styles';

interface InputProps {
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  ref?: any;
  error?: string;
  control?: any;
  returnKeyType?: ReturnKeyType;
  name: string;
  maxLength?: number;
  onSubmitEditing?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  type: TextInputMaskTypeProp;
  options?: TextInputMaskOptionProp;
  onChangeText?: (value: string) => void;
}

const InputFormMask: FC<InputProps> = ({
  type,
  options,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  control,
  name,
  maxLength,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}}) => (
        <>
          <Input
            type={type}
            options={options}
            placeholder={placeholder}
            autoComplete="off"
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            returnKeyType="done"
            autoCapitalize="none"
            value={value}
            maxLength={maxLength}
            {...rest}
          />
          {error && <Error>{error}</Error>}
        </>
      )}
    />
  );
};

export default InputFormMask;
