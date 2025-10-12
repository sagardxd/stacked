import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import { fetchBinanceKlines } from '@/services/binance.service';
import { Asset } from '@repo/types';
import { useThemeColor } from '@/hooks/use-theme-color';
interface AssetChartProps {
    asset: Asset;
}

type TimeInterval = '1m' | '5m' | '1h' | '4h' | '1d' | '1w';

const AssetChart: React.FC<AssetChartProps> = ({ asset }) => {
    const [chartData, setChartData] = useState<{ value: number; dataPointText: string; date: string }[]>([]);
    const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('1w');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Theme colors
    const backgroundColor = useThemeColor({}, 'background');
    const cardBg = useThemeColor({}, 'cardBg');
    const border = useThemeColor({}, 'border');
    const primary = useThemeColor({}, 'accent');
    const textSecondary = useThemeColor({}, 'text');

    const timeIntervals: { label: string; value: TimeInterval }[] = [
        { label: '1M', value: '1m' },
        { label: '5M', value: '5m' },
        { label: '1H', value: '1h' },
        { label: '4H', value: '4h' },
        { label: '1D', value: '1d' },
        { label: '1W', value: '1w' },
    ];

    const fetchChartData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchBinanceKlines(asset, selectedInterval, 20);

            // Add date information to the data with labels
            const dataWithDates = data.map((item: any, index: any) => {
                const now = new Date();
                const date = new Date(now.getTime() - (data.length - index - 1) * getIntervalMs(selectedInterval));
                const formattedDate = formatDate(date, selectedInterval);

                // Add labels for every few data points to show time on chart
                const shouldShowLabel = index % Math.max(1, Math.floor(data.length / 4)) === 0 || index === data.length - 1;

                return {
                    ...item,
                    date: formattedDate,
                    ...(shouldShowLabel && {
                        label: formattedDate,
                        labelTextStyle: { color: textSecondary, width: 60 }
                    })
                };
            });

            setChartData(dataWithDates);
        } catch (err) {
            setError('Failed to fetch chart data');
            console.error('Error fetching chart data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getIntervalMs = (interval: TimeInterval): number => {
        switch (interval) {
            case '1m': return 60 * 1000;
            case '5m': return 5 * 60 * 1000;
            case '1h': return 60 * 60 * 1000;
            case '4h': return 4 * 60 * 60 * 1000;
            case '1d': return 24 * 60 * 60 * 1000;
            case '1w': return 7 * 24 * 60 * 60 * 1000;
            default: return 60 * 60 * 1000;
        }
    };

    const formatDate = (date: Date, interval: TimeInterval): string => {
        // For all intervals, show consistent date format
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) {
            // If it's today, show time
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } else {
            // If it's not today, show date
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [asset, selectedInterval]);

    const dataMax = Math.max(...chartData.map(d => d.value));
    const dataMin = Math.min(...chartData.map(d => d.value));
    const priceRange = dataMax - dataMin;

    const maxValue = dataMax + (priceRange * 0.1); // 10% above highest price

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor }]}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: '#ff6b6b' }]}>{error}</Text>
                    <TouchableOpacity style={[styles.retryButton, { backgroundColor: primary }]} onPress={fetchChartData}>
                        <Text style={[styles.retryButtonText, { color: backgroundColor }]}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>

            {loading ? (
                <View style={[styles.loadingContainer, { backgroundColor }]}>
                    <ActivityIndicator size="large" color={primary} />
                </View>
            ): 

      (
            <View style={[styles.chartContainer, { backgroundColor: cardBg }]}>
                <LineChart
                    areaChart
                    curvature={0.1}
                    curved
                    data={chartData}
                    width={350}
                    hideDataPoints
                    spacing={15}
                    color="#ffffff"
                    thickness={2}
                    startFillColor="#393939"
                    endFillColor="#2A2A2A"
                    startOpacity={0.9}
                    endOpacity={0.2}
                    initialSpacing={0}
                    noOfSections={6}
                    maxValue={maxValue}
                    yAxisColor={border}
                    yAxisThickness={1}
                    rulesType="dotted"
                    rulesColor={border}
                    yAxisTextStyle={{ color: textSecondary, fontSize: 12 }}
                    xAxisColor={border}
                    hideYAxisText={false}
                    hideAxesAndRules={false}
                    xAxisLabelTextStyle={{ color: textSecondary, fontSize: 10 }}
                    pointerConfig={{
                        pointerStripHeight: -50,
                        pointerStripColor: border,
                        pointerStripWidth: 1,
                        pointerColor: primary,
                        radius: 4,
                        activatePointersOnLongPress: true,
                        autoAdjustPointerLabelPosition: true,
                        pointerLabelComponent: (items: any) => {
                            return (
                                <View style={styles.pointerLabel}>
                                    <Text style={[styles.pointerLabelDate, { color: textSecondary }]}>
                                        {items[0].date || 'N/A'}
                                    </Text>
                                    <View style={[styles.pointerLabelContent, { backgroundColor: "#ffffff" }]}>
                                        <Text style={[styles.pointerLabelValue, { color: backgroundColor }]}>
                                            ${items[0].value.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            </View>
      )}

             {/* Time Interval Toggle */}
             <View style={[styles.toggleContainer, { backgroundColor: cardBg }]}>
                {timeIntervals.map((interval) => (
                    <TouchableOpacity
                        key={interval.value}
                        style={[
                            styles.toggleButton,
                            selectedInterval === interval.value && { backgroundColor: primary }
                        ]}
                        onPress={() => setSelectedInterval(interval.value)}
                    >
                        <Text style={[
                            styles.toggleButtonText,
                            { color: textSecondary },
                            selectedInterval === interval.value && { color: backgroundColor, fontWeight: '600' }
                        ]}>
                            {interval.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        height: 350,
        alignItems: 'center',
        backgroundColor: 'red',
        gap: 10
    },
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    toggleButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    chartContainer: {
        width: '100%',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 8,
        overflow: 'hidden'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    pointerLabel: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -240,
        marginLeft: -50,
    },
    pointerLabelDate: {
        fontSize: 12,
        marginBottom: 4,
        textAlign: 'center',
    },
    pointerLabelContent: {
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 6,
    },
    pointerLabelValue: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default AssetChart;
