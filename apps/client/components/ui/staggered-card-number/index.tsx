import { StyleSheet, View } from 'react-native';

import { CardInfo } from './components/card-info';

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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export { StaggeredCardNumber };
