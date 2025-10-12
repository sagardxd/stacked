import { Validator } from '@/types/validator.types';
import apiCaller from './axios.service';
import { logger } from '@/utils/logger.service';

export const getValidators = async () => {
    try {
        const response = await apiCaller.get<Validator[]>('/validators');
        return response.data
    } catch (error) {
        logger.error("getValidators", "error getting validators", error)
        return []
    }
}


export const getValidatorById = async (id: string) => {
    try {
        const response = await apiCaller.get<Validator>('/validators', {
            params: { id }
        });
        return response.data
    } catch (error) {
        logger.error("getValidatorById", "error getting validator by id", error)
        return null
    }
}