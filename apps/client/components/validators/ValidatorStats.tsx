import React from 'react'
import { AppView } from '@/components/app-view'
import StatCard from '@/components/common/StatCard'
import { AppCardView } from '../app-card-view';

export type ValidatorStatsProps = {
    aprPercent: string;
    commissionPercent: string;
    jitoText: string;
    activeStakeText: string;
}

const ValidatorStats: React.FC<ValidatorStatsProps> = ({ aprPercent, commissionPercent, jitoText, activeStakeText }) => {
    return (
        <AppCardView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <StatCard label="Estimated APR" value={aprPercent} highlight />
            <StatCard label="Commission" value={commissionPercent} />
            <StatCard label="Jito MEV" value={jitoText} />
            <StatCard label="Active Stake" value={activeStakeText} />
        </AppCardView>
    )
}

export default ValidatorStats

