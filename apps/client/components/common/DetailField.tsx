import { useThemeColor } from "@/hooks/use-theme-color";
import { AppCardView } from "../app-card-view";
import { AppText } from "../app-text";
import { StyleSheet } from "react-native";

const DetailField = ({ label, value }: { label: string; value: string }) => {
    const textSecondary = useThemeColor({}, 'text');
    return (
        <AppCardView style={styles.detailField}>
            <AppText type="small" style={[styles.detailLabel, { color: textSecondary }]}>
                {label}
            </AppText>
            <AppText type="body" style={styles.detailValue}>{value}</AppText>
        </AppCardView>
    )
}

const styles = StyleSheet.create({
    detailField: {
        gap: 6,
    },
    detailLabel: {
        opacity: 0.7,
    },
    detailValue: {
        opacity: 1,
    },
})

export default DetailField