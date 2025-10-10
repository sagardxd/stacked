import { ApiResponse } from "@/types/api-response.types"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    validateStatus: (status) => {
        return status >= 200 && status <= 500
    }
})

const get = async <T> (url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(url, config);
    return response.data
}

const post = async <T> (url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data, config);
    return response.data
}

const apiCaller = {
    get,
    post
}   

export default apiCaller