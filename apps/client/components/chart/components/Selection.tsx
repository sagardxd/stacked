import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue, withTiming, runOnJS } from "react-native-reanimated";
import type { Graphs } from "../Model";
import { useThemeColor } from "@/hooks/use-theme-color";

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10

  },
  container: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  item: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export interface GraphState {
  next: number;
  current: number;
}

interface SelectionProps {
  state: SharedValue<GraphState>;
  transition: SharedValue<number>;
  graphs: Graphs;
}

export const Selection = ({ state, transition, graphs }: SelectionProps) => {
  const cardBg = useThemeColor({}, "cardBg");
  const border = useThemeColor({}, "border");
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const [selected, setSelected] = React.useState(0);

  // Sync selected index from reanimated shared value without reading during render
  useDerivedValue(() => {
    const next = state.value.next;
    runOnJS(setSelected)(next);
  }, [state]);

  return (
    <View style={styles.root}>
      <View style={styles.container}>        
        {graphs.map((graph, index) => {
          const isSelected = selected === index;
          return (
            <Pressable
              key={index}
              style={[
                styles.item,
                {
                  backgroundColor: isSelected ? background : cardBg,
                  borderWidth: isSelected ? 1 : 1,
                  borderColor: isSelected ? text : border,
                },
              ]}
              android_ripple={{ color: border }}
              onPress={() => {
                state.value = { current: state.value.next, next: index };
                transition.value = 0;
                transition.value = withTiming(1, { duration: 250 });
                setSelected(index);
              }}
            >
              <Text style={[
                styles.label,
                { color: text, opacity: isSelected ? 1 : 0.7, fontWeight: isSelected ? '700' : '400' },
              ]}>{graph.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
