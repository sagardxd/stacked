import React from 'react'
import DetailField from '@/components/common/DetailField'
import { AppCardView } from '../app-card-view';

export type ValidatorDetailsSectionProps = {
    about: string;
    stakePools: string;
    softwareClient: string;
}

const ValidatorDetailsSection: React.FC<ValidatorDetailsSectionProps> = ({ about, stakePools, softwareClient }) => {
    return (
        <AppCardView style={{ gap: 20 }}>
            <DetailField label="About" value={about} />
            <DetailField label="Stake Pools" value={stakePools} />
            <DetailField label="Software Client" value={softwareClient} />
        </AppCardView>
    )
}

export default ValidatorDetailsSection

