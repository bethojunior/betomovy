/* eslint-disable consistent-return */
// @ts-nocheck

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {styles} from './styles';

function OTPInput({onCompleteCode}, ref) {
  const inputNumberOneRef = useRef();
  const inputNumberTwoRef = useRef();
  const inputNumberThreeRef = useRef();
  const inputNumberFourRef = useRef();

  const [numberOne, setNumberOne] = useState('');
  const [numberTwo, setNumberTwo] = useState('');
  const [numberThree, setNumberThree] = useState('');
  const [numberFour, setNumberFour] = useState('');

  const deps = [numberOne, numberTwo, numberThree, numberFour];

  useEffect(() => {
    if (onCompleteCode) {
      const code = getCode();
      if (code.length === 4) onCompleteCode(code);
    }
  }, deps);

  const getCode = useCallback(
    () => `${numberOne}${numberTwo}${numberThree}${numberFour}`,
    deps,
  );

  useImperativeHandle(
    ref,
    () => ({
      getCode: () => getCode(),
    }),
    deps,
  );

  const handleFocus = useCallback(input => {
    input.focus();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputNumberOneRef}
        style={styles.input}
        keyboardType="number-pad"
        maxLength={1}
        value={numberOne}
        onChangeText={text => {
          if (text.trim().length === 0) return setNumberOne('');

          setNumberOne(text);
          handleFocus(inputNumberTwoRef.current);
        }}
      />
      <TextInput
        ref={inputNumberTwoRef}
        style={styles.input}
        keyboardType="number-pad"
        maxLength={1}
        value={numberTwo}
        onChangeText={text => {
          if (text.trim().length === 0) {
            return setNumberTwo('');
          }

          setNumberTwo(text);
          handleFocus(inputNumberThreeRef.current);
        }}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace') {
            if (numberTwo.trim().length === 0) {
              setNumberOne('');
              handleFocus(inputNumberOneRef.current);
            }
          }
        }}
      />
      <TextInput
        ref={inputNumberThreeRef}
        style={styles.input}
        keyboardType="number-pad"
        maxLength={1}
        value={numberThree}
        onChangeText={text => {
          if (text.trim().length === 0) {
            return setNumberThree('');
          }

          setNumberThree(text);
          handleFocus(inputNumberFourRef.current);
        }}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace') {
            if (numberThree.trim().length === 0) {
              setNumberTwo('');
              handleFocus(inputNumberTwoRef.current);
            }
          }
        }}
      />
      <TextInput
        ref={inputNumberFourRef}
        style={styles.input}
        keyboardType="number-pad"
        maxLength={1}
        value={numberFour}
        onChangeText={text => {
          if (text.trim().length === 0) {
            return setNumberFour('');
          }

          setNumberFour(text);
        }}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace') {
            if (numberFour.trim().length === 0) {
              setNumberThree('');
              handleFocus(inputNumberThreeRef.current);
            }
          }
        }}
      />
    </View>
  );
}

export default forwardRef(OTPInput);
