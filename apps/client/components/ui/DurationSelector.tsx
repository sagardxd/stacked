import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/app-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface DurationSelectorProps {
  selectedDuration: number;
  selectedUnit: 'Months' | 'Years';
  onDurationChange: (duration: number) => void;
  onUnitChange: (unit: 'Months' | 'Years') => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  selectedUnit,
  onDurationChange,
  onUnitChange,
}) => {
  const text = useThemeColor({}, 'text');
  const accent = useThemeColor({}, 'accent');
  const border = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'cardBg');

  // Define presets for each unit
  const durationPresets = {
    Months: [1, 2, 5, 8, 10, 12],
    Years: [1, 2, 3, 5, 10]
  };

  const currentPresets = durationPresets[selectedUnit];

  return (
    <View style={styles.container}>
      <AppText type='label' style={{ color: text + '99' }}>Select lock duration</AppText>
      
      {/* Unit Toggle */}
      <View style={[styles.unitToggleContainer, { backgroundColor: cardBg, borderColor: border }]}>
        {(['Months', 'Years'] as const).map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[
              styles.unitToggleButton,
              selectedUnit === unit && { backgroundColor: accent }
            ]}
            onPress={() => onUnitChange(unit)}
          >
            <AppText 
              type='body' 
              style={{ 
                color: selectedUnit === unit ? '#FFFFFF' : text + '80',
                fontWeight: selectedUnit === unit ? '600' : '500'
              }}
            >
              {unit}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Duration Presets */}
      <View style={[styles.durationContainer, { backgroundColor: cardBg, borderColor: border }]}>
        {currentPresets.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationButton,
              selectedDuration === duration && { backgroundColor: accent }
            ]}
            onPress={() => onDurationChange(duration)}
          >
            <AppText 
              type='body' 
              style={{ 
                color: selectedDuration === duration ? '#FFFFFF' : text + '80',
                fontWeight: selectedDuration === duration ? '600' : '500'
              }}
            >
              {duration}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  unitToggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  unitToggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DurationSelector;
