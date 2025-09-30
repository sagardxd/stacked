import React, { useState } from "react";
import { View, Pressable, StyleSheet, Text as RNText, Animated } from "react-native";
import {
    Canvas,
    Circle,
    Path,
    Skia,
    Text,
    useFont,
    LinearGradient,
    vec,
    BlurMask,
} from "@shopify/react-native-skia";

interface RingProps {
    size: number;
    strokeWidth: number;
    progress?: number;
    amount: string;
    subtitle: string;
    segments?: Array<{ value: number; color: string; label?: string }>;
    gapDegrees?: number;
}

export const BalanceRing: React.FC<RingProps> = ({
    size,
    strokeWidth,
    progress = 0,
    amount,
    subtitle,
    segments,
    gapDegrees = 6,
}) => {
    const CircleViewSize = size + 10
    const font = useFont(require("@/assets/fonts/Sk-Modernist-Bold.otf"), 28);
    const subtitleFont = useFont(require("@/assets/fonts/Sk-Modernist-Regular.otf"), 16);

    const [selectedSegment, setSelectedSegment] = useState<{
        index: number;
        x: number;
        y: number;
    } | null>(null);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const timeoutRef = React.useRef<number | null>(null);

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!font || !subtitleFont) {
        return <View style={{ width: size, height: size }} />;
    }

    const canvasSize = CircleViewSize + 10;
    const radius = (size - strokeWidth) / 2;
    const center = canvasSize / 2;

    const rect = {
        x: strokeWidth / 2 + 5,
        y: strokeWidth / 2 + 5,
        width: size - strokeWidth,
        height: size - strokeWidth,
    };
    const startAngleDeg = -90;
    const totalDegrees = 360;

    const getSegmentFromTouch = (x: number, y: number) => {
        if (!segments || segments.length === 0) return null;

        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const innerRadius = radius - strokeWidth / 2;
        const outerRadius = radius + strokeWidth / 2;
        if (distance < innerRadius || distance > outerRadius) {
            return null;
        }

        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360;

        let currentAngle = 0;
        for (let i = 0; i < segments.length; i++) {
            const segmentDegrees = segments[i].value * totalDegrees;
            if (angle >= currentAngle && angle < currentAngle + segmentDegrees) {
                // Calculate position at the middle of the segment on the outer edge
                const midAngle = currentAngle + segmentDegrees / 2 - 90; // -90 to start from top
                const radians = (midAngle * Math.PI) / 180;
                const labelRadius = radius + strokeWidth / 2 + 20; // Just outside the ring
                
                return {
                    index: i,
                    x: center + labelRadius * Math.cos(radians),
                    y: center + labelRadius * Math.sin(radians),
                };
            }
            currentAngle += segmentDegrees;
        }

        return null;
    };

    const handlePress = (event: any) => {
        const { locationX, locationY } = event.nativeEvent;
        const result = getSegmentFromTouch(locationX, locationY);
        
        if (result !== null) {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // If switching segments, fade out old one first
            if (selectedSegment !== null && selectedSegment.index !== result.index) {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }).start(() => {
                    setSelectedSegment(result);
                    // Fade in new one
                    Animated.spring(fadeAnim, {
                        toValue: 1,
                        tension: 100,
                        friction: 7,
                        useNativeDriver: true,
                    }).start();
                });
            } else {
                // First time or same segment
                setSelectedSegment(result);
                fadeAnim.setValue(0);
                Animated.spring(fadeAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 7,
                    useNativeDriver: true,
                }).start();
            }
            
            // Set new 3 second timeout
            timeoutRef.current = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }).start(() => setSelectedSegment(null));
            }, 2000);
        }
    };

    return (
        <View style={{ width: CircleViewSize + 20, height: CircleViewSize + 20, justifyContent: 'center', alignItems: 'center'}}>
            <Pressable onPress={handlePress} style={{ margin: 15}}>
                <Canvas style={{ width: CircleViewSize + 10, height: CircleViewSize + 10 }}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        color="rgba(255,255,255,0.05)"
                        style="stroke"
                        strokeWidth={strokeWidth}
                    />

                    {Array.isArray(segments) && segments.length > 0 ? (
                        (() => {
                            let currentStart = startAngleDeg;
                            return segments.map((seg, index) => {
                                const sweep = Math.max(0, Math.min(1, seg.value)) * totalDegrees;
                                const visibleSweep = Math.max(0, sweep - gapDegrees);
                                const path = Skia.Path.Make();
                                path.addArc(rect, currentStart, visibleSweep);
                                
                                const isSelected = selectedSegment?.index === index;
                                
                                const el = (
                                    <Path
                                        key={`seg-${index}`}
                                        path={path}
                                        style="stroke"
                                        strokeWidth={isSelected ? strokeWidth + 1.5 : strokeWidth}
                                        strokeCap="round"
                                        color={seg.color}
                                        opacity={isSelected ? 1 : 0.85}
                                    >
                                        <BlurMask blur={isSelected ? 2 : 1} style="solid" />
                                    </Path>
                                );
                                currentStart += sweep;
                                return el;
                            });
                        })()
                    ) : (
                        (() => {
                            const path = Skia.Path.Make();
                            path.addArc(rect, startAngleDeg, progress * totalDegrees);
                            return (
                                <Path path={path} style="stroke" strokeWidth={strokeWidth} strokeCap="round">
                                    <LinearGradient start={vec(0, 0)} end={vec(size, size)} colors={["#7B2FF7", "#22D3EE"]} />
                                </Path>
                            );
                        })()
                    )}

                    <Text
                        x={center - font.measureText(amount).width / 2}
                        y={center - 10}
                        text={amount}
                        color="white"
                        font={font}
                    />

                    <Text
                        x={center - subtitleFont.measureText(subtitle).width / 2}
                        y={center + 20}
                        text={subtitle}
                        color="#A78BFA"
                        font={subtitleFont}
                    />
                </Canvas>
            </Pressable>

            {selectedSegment !== null && segments && segments[selectedSegment.index] && (
                <Animated.View
                    style={[
                        styles.tooltip,
                        {
                            left: selectedSegment.x - 40,
                            top: selectedSegment.y - 45,
                            opacity: fadeAnim,
                            transform: [
                                {
                                    scale: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <RNText style={styles.tooltipLabel}>
                        {segments[selectedSegment.index].label || `Segment ${selectedSegment.index + 1}`}
                    </RNText>
                    <RNText style={styles.tooltipValue}>
                        {(segments[selectedSegment.index].value * 100).toFixed(1)}%
                    </RNText>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    tooltip: {
        position: "absolute",
        backgroundColor: "rgba(15, 15, 15, 0.95)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        minWidth: 70,
        alignItems: "center",
    },
    tooltipLabel: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    tooltipValue: {
        color: "#A78BFA",
        fontSize: 11,
        marginTop: 1,
    },
});