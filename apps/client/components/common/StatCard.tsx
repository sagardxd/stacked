import { useThemeColor } from "@/hooks/use-theme-color";
import { AppView } from "../app-view";
import { AppText } from "../app-text";
import { StyleSheet } from "react-native";

type StatCardProps =  { 
    label: string; 
    value: string; 
    highlight?: boolean, 
    textType?: "medium" | "small" }

const StatCard = ({ label, value, highlight, textType = "medium" }: StatCardProps) => {
    const border = useThemeColor({}, 'border');
    return (
        <AppView style={[styles.statCard, { borderColor: border }]}>
            <AppText type="caption" style={styles.statLabel}>{label}</AppText>
            <AppText type="medium" style={[styles.statValue, highlight && styles.highlightValue, textType === 'small' && {fontSize: 14}]}>
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