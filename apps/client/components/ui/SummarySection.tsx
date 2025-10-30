import React from 'react';
import { StyleSheet } from 'react-native';
import { AppView } from '@/components/app-view';
import { AppText } from '@/components/app-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAssetStore } from '@/store/asset.store';
import { Asset } from '@/types/asset.types';

interface SummarySectionProps {
    quantity: string;
    duration: number;
    durationUnit: 'Months' | 'Years';
}

const SummarySection: React.FC<SummarySectionProps> = ({
    quantity,
    duration,
    durationUnit,
}) => {
    const text = useThemeColor({}, "text");
    const accent = useThemeColor({}, "accent");

    const assetPrice = useAssetStore((state) => state.getAsset(Asset.SOL));

    if (!assetPrice) return null;

    // Calculate USD value from SOL amount
    const solAmount = parseFloat(quantity || '0');
    const assetPriceInDecimal = (assetPrice.currPrice / Math.pow(10, assetPrice.decimal));
    const usdValue = solAmount * assetPriceInDecimal;

    // Calculate estimated returns based on APR and duration
    const durationInYears = durationUnit === 'Months' ? (duration / 12) : duration;
    const estimatedReturns = usdValue * durationInYears;
    const totalValue = usdValue;

    return (
        <AppView style={styles.container}>
            {/* Estimated Returns */}
            {/* <AppView style={styles.row}>
                <AppView>
                    <AppText type='body' style={{ color: text }}>Estimated returns</AppText>
                </AppView>
                <AppView style={styles.returnsContainer}>
                    <AppText type='body' style={{ color: accent }}>+${estimatedReturns.toFixed(2)}</AppText>
                </AppView>
            </AppView> */}

            {/* Total Value */}
            <AppView style={[styles.row, styles.totalRow]}>
                <AppText type='button' style={{ color: text }}>Total value</AppText>
                <AppText type='body' style={{ color: text }}>${totalValue.toFixed(2)}</AppText>
            </AppView>
        </AppView>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
        paddingVertical: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalRow: {
        marginTop: 4,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    returnsContainer: {
        alignItems: 'flex-end',
    },
    divider: {
        height: 1,
        marginVertical: 4,
    },
});

export default SummarySection;