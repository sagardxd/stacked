import React from 'react'
import DetailField from '@/components/common/DetailField'
import { AppCardView } from '../app-card-view';

export type ValidatorDetailsSectionProps = {
    about: string;
    voteAccount: string;
    network: string;
    createdAt?: string;
    updatedAt?: string;
}

const ValidatorDetailsSection: React.FC<ValidatorDetailsSectionProps> = ({ about, voteAccount, network, createdAt, updatedAt }) => {
    return (
        <AppCardView style={{ gap: 20 }}>
            <DetailField label="About" value={about} />
            <DetailField label="Vote Account" value={voteAccount} />
            <DetailField label="Network" value={network} />
            {createdAt && <DetailField label="Created At" value={new Date(createdAt).toLocaleDateString()} />}
            {updatedAt && <DetailField label="Last Updated" value={new Date(updatedAt).toLocaleDateString()} />}
        </AppCardView>
    )
}

export default ValidatorDetailsSection

