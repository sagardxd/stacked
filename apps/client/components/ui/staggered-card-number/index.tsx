import { StyleSheet, View } from 'react-native';

import { CardInfo } from './components/card-info';
import { useThemeColor } from '@/hooks/use-theme-color';

type StaggeredCardNumberProps = {
  balance: string
}

const StaggeredCardNumber = ({ balance }: StaggeredCardNumberProps) => {

  return (
    <View style={[styles.container]}>
      <CardInfo cardNumber={balance} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { StaggeredCardNumber };
