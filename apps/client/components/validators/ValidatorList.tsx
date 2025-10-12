import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        fetchValidators();
    }, []);

    const fetchValidators = async () => {
        setLoading(true);
        console.log('getting')
        const data = await getValidators();
        console.log(data)
        setValidators(data || []);
        setLoading(false);
    };

    const handleOnPress = (id: string) => {
        router.push(`/(tabs)/home/validator/${id}`)
    }

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