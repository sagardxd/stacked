import type { SharedValue } from "react-native-reanimated";
import { withDecay } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { useMemo } from "react";

export const useGraphTouchHandler = (x: SharedValue<number>, width: number) => {
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((pos) => {
          const dx = (pos as any).changeX ?? pos.x ?? 0;
          const next = x.value + dx;
          x.value = Math.max(0, Math.min(width, next));
        })
        .onEnd(({ velocityX }) => {
          x.value = withDecay({ velocity: velocityX, clamp: [0, width] });
        }),
    [width, x]
  );
  return gesture;
};
