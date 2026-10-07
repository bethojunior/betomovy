// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {styles} from './styles';

export default function TextTimeCount(props) {
  const {onComplete, start, description, onRestart} = props;

  const [timeResend, setTimeResend] = useState(start || 10);
  const [disabledResend, setDisabledResend] = useState(true);

  useEffect(() => {
    let interval = null;
    if (disabledResend) {
      interval = setInterval(() => {
        if (timeResend > 0) {
          setTimeResend(timeResend - 1);
        } else {
          if (onComplete) onComplete();
          setDisabledResend(false);
          clearInterval(interval);
        }
      }, 1000);
      // eslint-disable-next-line eqeqeq
    } else if (timeResend == 0 && !disabledResend) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [disabledResend, timeResend]);

  function handleResend() {
    setDisabledResend(true);
    setTimeResend(start || 10);
    if (onRestart) onRestart();
  }

  return (
    <TouchableOpacity disabled={disabledResend} onPress={() => handleResend()}>
      <View>
        <Text style={disabledResend ? styles.textDisabled : styles.textActive}>
          {description || ''}
          {disabledResend ? ` - ${converSecondsInTime(timeResend)}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function converSecondsInTime(time) {
  const date = new Date();
  date.setTime(time * 1000);

  return `${digitsToTheLeft(2, date.getMinutes())}:${digitsToTheLeft(
    2,
    date.getSeconds(),
  )}`;
}

function digitsToTheLeft(amount, text) {
  return `00${text}`.slice(-amount);
}
