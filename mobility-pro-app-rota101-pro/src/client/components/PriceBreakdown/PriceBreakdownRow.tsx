import { View, Text } from 'react-native';
import styles from './styles';
import { PriceBreakdownRowProps } from './types';

const PriceBreakdownRow = ({ label, value, emphasis }: PriceBreakdownRowProps) => (
  <View style={styles.row}>
    <Text style={[styles.label, emphasis && styles.emphasis]}>{label}</Text>
    <Text style={[styles.value, emphasis && styles.emphasis]}>{value}</Text>
  </View>
);

export default PriceBreakdownRow;
