import React from 'react';
import { StyleSheet, } from 'react-native';
import { AppText } from '@/components/app-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AppView } from '../app-view';

interface SaleHeaderProps {
    onBackPress?: () => void;
    totalListings?: number;
}

export const SaleHeader: React.FC<SaleHeaderProps> = ({
    totalListings
}) => {
    const textColor = useThemeColor({}, 'text');
    const border = useThemeColor({}, 'border');

    return (
        <AppView>
            {totalListings !== undefined && (
                <AppText type="caption" style={styles.subtitle}>
                    {totalListings} listings available
                </AppText>
            )}
        </AppView>
    );
};

const styles = StyleSheet.create({
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.7,
    },
});