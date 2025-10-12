import React, { useEffect, useState, useCallback } from 'react'
import { AppView } from '../app-view'
import { AppText } from '../app-text'
import { Validator } from '@/types/validator.types'
import ValidatorCard from './ValidatorCard'
import { useRouter } from 'expo-router'
import { getValidators } from '@/services/validator.services'


const ValidatorList = () => {
    const router = useRouter();
    const [validators, setValidators] = useState<Validator[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchValidators = useCallback(async () => {
        setLoading(true);
        const data = await getValidators();
        setValidators(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchValidators();
    }, [fetchValidators]);

    const handleOnPress = useCallback((id: string) => {
        router.push(`/(tabs)/home/validator/${id}`)
    }, [router]);

    if (loading) {
        return (
            <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <AppText>Loading validators...</AppText>
            </AppView>
        );
    }

    return (
        <AppView>
            {validators.map((validator) => (
                <ValidatorCard key={validator.id} validator={validator} onPress={handleOnPress} />
            ))}
        </AppView>
    )
}

export default ValidatorList