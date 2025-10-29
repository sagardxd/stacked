import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useState, type FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';

import { TouchableFeedback } from '../touchables/touchable-feedback';

import { HideableNumber } from './hideable-number';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AppText } from '@/components/app-text';

type CardInfoProps = {
  cardNumber: string;
};

export const CardInfo: FC<CardInfoProps> = memo(({ cardNumber }) => {
  const splittedNumber = cardNumber.toString().split('');
  const text = useThemeColor({}, "text")

  const [toggled, setToggled] = useState(false);

  const hiddenIndexes = useDerivedValue(() => {
    if (toggled) {
      return Array.from({ length: 12 }, (_, index) => index);
    }
    return [];
  }, [toggled]);

  const onToggle = useCallback(() => {
    setToggled(prev => !prev);
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={styles.balanceContent}>
        <AppText type="body" style={[styles.title, {color: text + '99'}]}>Balance</AppText>
        <View style={styles.numbers}>
          {splittedNumber.map((number, index) => {
            return (
              <View
                key={index}
                style={{
                  marginRight: 0,
                }}>
                <HideableNumber
                  number={number}
                  hiddenIndexes={hiddenIndexes}
                  index={index}
                />
              </View>
            );
          })}
        </View>
      </View>
      <TouchableFeedback onTap={onToggle} style={styles.button}>
        <Feather name={toggled ? 'eye' : 'eye-off'} size={24} color="#38a27b" />
      </TouchableFeedback>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceContent: {
    flex: 1,
  },
  title: {
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  numbers: {
    flexDirection: 'row',
    marginTop: 5,
    overflow: 'hidden',
  },
});
