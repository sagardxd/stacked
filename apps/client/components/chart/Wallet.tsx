import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import {
  Canvas,
  Path,
  Group,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";

import { PADDING, COLORS, getGraph } from "./Model";
import { getYForX } from "./Math";
import { Cursor } from "./components/Cursor";
import { Selection } from "./components/Selection";
import { Label } from "./components/Label";
import { useGraphTouchHandler } from "./components/useGraphTouchHandler";
import { useThemeColor } from "@/hooks/use-theme-color";

const touchableCursorSize = 80;
const GRAPH_HORIZONTAL_PADDING = 0; // Add horizontal padding to keep cursor in view

export const Wallet = () => {
  const cardBg = useThemeColor({}, "cardBg") 
  const window = useWindowDimensions();

  const { width : InitialWidth } = window;
  const width = Math.max(0, InitialWidth);
  const graphWidth = width - 40; // Reduce graph width by padding
  const height = Math.min(window.width, window.height) / 2.5;
  const translateY = height + PADDING;
  const graphs = useMemo(() => getGraph(graphWidth, height), [graphWidth, height]);
  // animation value to transition from one graph to the next
  const transition = useSharedValue(0);
  // indicices of the current and next graphs
  const state = useSharedValue({
    next: 0,
    current: 0,
  });
  // path to display
  const path = useDerivedValue(() => {
    const { current, next } = state.value;
    const start = graphs[current].data.path;
    const end = graphs[next].data.path;
    return end.interpolate(start, transition.value)!;
  });
  
  // filled path for shadow effect
  const fillPath = useDerivedValue(() => {
    const originalPath = path.value;
    const fillPath = originalPath.copy();
    
    // Get the last point of the path
    const cmds = originalPath.toCmds();
    if (cmds.length > 0) {
      const lastCmd = cmds[cmds.length - 1];
      const lastX = lastCmd[lastCmd.length - 2] as number;
      
      // Add lines to create the filled area
      fillPath.lineTo(lastX, height - PADDING * 2); // Go down to bottom
      fillPath.lineTo(0, height - PADDING * 2); // Go to bottom left
      fillPath.close(); // Close the path
    }
    
    return fillPath;
  });
  // x and y values of the cursor
  const x = useSharedValue(10);
  const y = useDerivedValue(() => getYForX(path.value.toCmds(), x.value));
  const gesture = useGraphTouchHandler(x, graphWidth);
  const style = useAnimatedStyle(() => {
    const horizontalOffset = GRAPH_HORIZONTAL_PADDING / 2; // Center the graph horizontally
    const cursorX = x.value + 0; // Add offset to match graph position
    return {
      position: "absolute",
      width: touchableCursorSize,
      height: touchableCursorSize,
      left: Math.max(horizontalOffset, Math.min(width - horizontalOffset - touchableCursorSize, cursorX - touchableCursorSize / 2)),
      top: translateY + Math.max(0, Math.min(height + 50 - touchableCursorSize, y.value - touchableCursorSize / 2)),
    };
  });
  return (
    <View style={{backgroundColor: cardBg, borderRadius: 20, overflow: 'hidden'}}>
      <View>
        <Canvas style={{ width, height: height + 200, overflow: 'hidden' }}>
          <Label
            state={state}
            y={y}
            graphs={graphs}
            width={width}
            height={height}
          />
          <Group transform={[{ translateY }, { translateX: GRAPH_HORIZONTAL_PADDING / 2 }]} >
            {/* Filled area for shadow effect */}
            <Path
              style="fill"
              path={fillPath}
              >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, height - PADDING * 2)}
                colors={["rgba(246, 157, 105, 0.3)", "rgba(246, 157, 105, 0.05)", "rgba(246, 157, 105, 0)"]}
                />
            </Path>
            {/* Stroke line */}
            <Path
              style="stroke"
              path={path}
              strokeWidth={4}
              strokeJoin="round"
              strokeCap="butt"
              >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(graphWidth, 0)}
                colors={COLORS}
                />
            </Path>
            <Cursor x={x} y={y} width={graphWidth} />
          </Group>
        </Canvas>
        <GestureDetector gesture={gesture}>
          <Animated.View style={style} />
        </GestureDetector>
      </View>
      <Selection state={state} transition={transition} graphs={graphs} />
    </View>
  );
};
