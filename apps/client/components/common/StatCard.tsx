import { useThemeColor } from "@/hooks/use-theme-color";
import { AppView } from "../app-view";
import { AppText } from "../app-text";
import { StyleSheet } from "react-native";

const StatCard = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => {
    const border = useThemeColor({}, 'border');
    return (
        <AppView style={[styles.statCard, { borderColor: border }]}>
            <AppText type="caption" style={styles.statLabel}>{label}</AppText>
            <AppText type="medium" style={[styles.statValue, highlight && styles.highlightValue]}>
                {value}
            </AppText>
        </AppView>
    )
}

const styles = StyleSheet.create({

    statCard: {
        flex: 1,
        minWidth: '47%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },
    statLabel: {
        opacity: 0.6,
    },
    statValue: {
        fontSize: 20,
    },
    highlightValue: {
        color: '#00BFFF',
    },
})

export default StatCard